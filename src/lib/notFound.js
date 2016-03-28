/*************************
 * Application middleware that returns a 404
 * Should be the last middleware in the pipeline
 *
 * @type {fourOFour}
 ************************/

var logger = require('./logger')(module);
var response = require('./response');
var environment = require('./config').environment;

module.exports = fourOFour;

function fourOFour(req, res) {
    // Checks if headers are already sent
    if (res.headersSent) {
        return res.end();
    }
    // If not then build 404 response.
    var internalMessage = 'Unable to find route: ' + req.url;
    var message = 'Not Found';
    if ('development' === environment) {
        message = internalMessage;
        logger.error(internalMessage);
    }
    res.status(404).send(
        response.error(404, message)
    ).end();
}
