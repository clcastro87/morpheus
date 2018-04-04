/*************************
 * Application middleware that returns a 404
 * Should be the last middleware in the pipeline
 *
 * @type {fourOFour}
 * @author: Carlos Luis Castro Márquez
 ************************/

var response = require('./response');
const DEBUG_SIGNATURE = 'restier.middleware.notFound';
var debug = require('debug')(DEBUG_SIGNATURE);
var environment = (process.env && process.env.NODE_ENV) || 'development';

module.exports = fourOFour;

function fourOFour(req, res) {
    // Checks if headers was already sent
    if (res.headersSent) {
        return res.end();
    }
    // If not then build 404 response.
    var internalMessage = 'Unable to find route: ' + req.url;
    debug(internalMessage);
    // Transform message in development to find out route error.
    var message = 'Not Found';
    if ('development' === environment) {
        message = internalMessage;
    }
    res
        .status(404)
        .send(response.error(404, message))
        .end();
}
