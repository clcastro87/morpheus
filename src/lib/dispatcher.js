/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var response = require('./response');
var Status = require('./status');

module.exports = function(config) {

    function dispatcher(req, res, next) {
        res.dispatch = dispatch.bind({ request: req, response: res, next: next });
        next();
    }

    function dispatch() {
        var requestHandler = this;
        var responder = writeResponse.bind(requestHandler);

        var args = Array.prototype.slice.call(arguments);
        if (!args.length) {
            responder(response.fromHttpStatus(Status.OK));
        }
        else if (args[0] instanceof Error) {
            requestHandler.next(args[0]);
        }
        else if (args[0] instanceof Status) {
            responder(response.fromHttpStatus(args[0], args[1]));
        }
        else if (typeof args[0] === 'function') {
            args[0](function (err, result) {
                if (err) {
                    requestHandler.next(err);
                }
                else {
                    responder(response.fromHttpStatus(Status.OK, result));
                }
            });
        }
        else if (args[0].then && typeof args[0].then === 'function') {
            args[0]
                .then(function (result) {
                    responder(response.fromHttpStatus(Status.OK, result));
                })
                .catch(function (err) {
                    requestHandler.next(err);
                });
        }
        else {
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

