/**
 * Generates consistent API service output
 *
 * @author: Carlos Luis Castro Márquez
 */
(function (response) {
    'use strict';

    // Module exports
    response.success = success;
    response.error = error;
    response.makeResponse = makeResponse;
    response.fromHttpStatus = fromHttpStatus;

    /**
     * Gives a success API response
     *
     * @param {Object} result Object to put in response.result
     * */
    function success(result) {
        return makeResponse(result);
    }

    /**
     * Gives an error API response
     *
     * @param {Number} code Error code. It could be a HTTP status code.
     * @param {String} description Error description. It could be a HTTP status description.
     * */
    function error(code, description) {
        return makeResponse(null, code, description);
    }

    /**
     * Gives a custom API response
     *
     * @param {Object|String|Number} result Object to put in response.result
     * @param {Number} code Error code. It could be a HTTP status code.
     * @param {String} description Error description. It could be a HTTP status description.
     * */
    function makeResponse(result, code, description) {
        return {
            status: {
                code: code || 200,
                description: description || 'OK'
            },
            result: result === undefined ? null : result
        };
    }

    /**
     * Builds an automatic response based on common callback response function.
     * If an error is sent as first parameter, then is a response error,
     * otherwise returns a success response.
     *
     * @param {Error} err Callback error, if code is set then result is an empty object.
     * @param {Object} result Callback result.
     * */
    function fromCallback(err, result) {
        if (err) {
            return error(err.statusCode || 500, err.message || 'Internal Server Error');
        }
        return success(result);
    }

    /**
     * Builds an automatic response based on HttpStatus Object.
     * Also you can send a customized error if description param is set.
     *
     * @param {Status} status Http status.
     * @param {String} result Callback result.
     * */
    function fromHttpStatus(status, result) {
        if (status.code >= 400) {
            return error(status.code || 500, status.toString());
        }
        return makeResponse(result, status.code, status.description);
    }

})(module.exports);
