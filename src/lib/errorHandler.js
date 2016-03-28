/*************************
 * Application middleware that returns an error to the client
 * Should be the last middleware in the pipeline
 * Can turn a specially formatted error object into an error response with a status code
 *
 * If no statusCode, statusCode = 500
 * If err.message, the message is the body
 * If no err.message, the err itself is the body.
 * If in development environment
 *    - logs the error to console
 *    - if err.stack, logs the stack trace to console
 *
 * @type {errorHandler}
 ************************/

var logger = require('./logger')(module);
var response = require('./response');
var environment = require('./config').environment;

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (err) {
        var body = err.message || err;
        var status = err.statusCode || 500;
        // Avoid sending custom error messages in production
        if ('development' !== environment && status === 500) {
            body = 'Internal Server Error';
        }
        res.status(status).send(response.error(status, body));
        logError(err, status, body);
    }
}

function logError(err, status, body) {
    // If environment is development then log to console
    if ('development' === environment) {
        // Execute task in next iteration of the event loop.
        process.nextTick(log);
    }

    function log() {
        var stack = '';
        var msg = '\n--------------\n' + status + ' - ' + body;
        // log all inner errors too
        while (err) {
            stack = err.stack || stack; // get deepest stack
            err = err.innerError;
            if (err && err.message) {
                msg += '\n' + err.message;
            }
        }
        // log deepest stack
        if (stack) {
            msg += '\n' + stack;
        }
        //console.error(msg+'\n--------------');
        msg += '\n--------------';
        logger.error(msg);
    }
}
