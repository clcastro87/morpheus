var MockRes = require('mock-res');
var util = require('util');
var StatusCodes = require('http').STATUS_CODES;

/**
 * Response prototype.
 */

function Response() {
    MockRes.call(this);

    this.headersSent = false;
    this.content = '';
}

util.inherits(Response, MockRes);

Response.prototype.set = function (field, val) {
    if (arguments.length === 2) {
        var value = Array.isArray(val)
            ? val.map(String)
            : String(val);

        this.setHeader(field, value);
    } else {
        for (var key in field) {
            this.set(key, field[key]);
        }
    }
    return this;
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @public
 */

Response.prototype.get = function(field){
    return this.getHeader(field);
};

Response.prototype.status = function(statusCode) {
    if (statusCode == undefined)
        return this.statusCode;

    this.statusCode = statusCode;
    this.statusMessage = StatusCodes[statusCode];
    this.headersSent = true;
    return this;
}

Response.prototype.send = function(data) {
    if (data.toString() == '[object Object]') 
        this.content = JSON.stringify(data);
    else
        this.content = data;

    this.write(this.content);
    return this;
}

module.exports = Response;
