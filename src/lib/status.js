/**
 * Status handler.
 *
 * @author: Carlos Luis Castro Márquez
 * @date: 03/21/2015
 */
'use strict';

// Module requires
var http = require('http');

// Private fields
var statusCodes = http.STATUS_CODES;
var unknownStatus = 'Unknown Status';

function Status(code, description) {
    this.code = code || 200;
    this.description = description || 'OK';
}

Status.byCode = getInstance;
// Codes abbreviation
Status.OK = getInstance(200);
Status.CREATED = getInstance(201);
Status.ACCEPTED = getInstance(202);
Status.NO_CONTENT = getInstance(204);
Status.MOVED_PERMANENTLY = getInstance(301);
Status.FOUND = getInstance(302);
Status.SEE_OTHER = getInstance(303);
Status.NOT_MODIFIED = getInstance(304);
Status.TEMPORARY_REDIRECT = getInstance(307);
Status.BAD_REQUEST = getInstance(400);
Status.UNAUTHORIZED = getInstance(401);
Status.PAYMENT_REQUIRED = getInstance(402);
Status.FORBIDDEN = getInstance(403);
Status.NOT_FOUND = getInstance(404);
Status.METHOD_NOT_ALLOWED = getInstance(405);
Status.NOT_ACCEPTABLE = getInstance(406);
Status.CONFLICT = getInstance(409);
Status.GONE = getInstance(410);
Status.PRECONDITION_FAILED = getInstance(412);
Status.ENTITY_TOO_LARGE = getInstance(413);
Status.URI_TOO_LONG = getInstance(414);
Status.UNSUPPORTED_MEDIA_TYPE = getInstance(415);
Status.TOO_MANY_REQUESTS = getInstance(429);
Status.INTERNAL_SERVER_ERROR = getInstance(500);
Status.NOT_IMPLEMENTED = getInstance(501);
Status.SERVICE_UNAVAILABLE = getInstance(503);
Status.UNKNOWN = getInstance(0);

function getInstance(code) {
    return new Status(code, statusCodes[code] || unknownStatus);
}

exports = module.exports = Status;