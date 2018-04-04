var response = require('./response');
var Status = require('./status');
const DEBUG_SIGNATURE = 'restier.dispatcher';
var debug = require('debug')(DEBUG_SIGNATURE);

module.exports = function(config) {

    function dispatcher(req, res, next) {
        res.dispatch = dispatch.bind({request: req, response: res, next: next});
        next();
    }

    function dispatch() {
        var requestHandler = this;
        var responder = writeResponse.bind(requestHandler);
        var args = Array.prototype.slice.call(arguments);
        if (!args.length) {
            debug('Dispatching Http OK.');
            responder(response.fromHttpStatus(Status.OK));
        }
        else if (args[0] instanceof Error) {
            debug('Dispatching error.');
            requestHandler.next(args[0]);
        }
        else if (args[0] instanceof Status) {
            debug('Dispatching Http Status.');
            responder(response.fromHttpStatus(args[0], args[1]));
        }
        else if (typeof args[0] === 'function') {
            args[0](function (err, result) {
                if (err) {
                    debug('Dispatching callback with error.');
                    requestHandler.next(err);
                }
                else {
                    debug('Dispatching callback with result.');
                    responder(response.fromHttpStatus(Status.OK, result));
                }
            });
        }
        else if (args[0].then && typeof args[0].then === 'function') {
            args[0]
                .then(function (result) {
                    debug('Dispatching promise with result.');
                    responder(response.fromHttpStatus(Status.OK, result));
                })
                .catch(function (err) {
                    debug('Dispatching promise with error.');
                    requestHandler.next(err);
                });
        }
        else if (typeof args[0] === 'object') {
            debug('Dispatching object to response.');
            responder(response.fromHttpStatus(Status.OK, args[0]));
        }
        else {
            debug('Unknown dispatch case. I\'ts not implemented');
            responder(response.fromHttpStatus(Status.NOT_IMPLEMENTED));
        }
    }

    function writeResponse(result) {
        this.response
            .status(result.status.code)
            .json(result);
    }

    return dispatcher;
};

