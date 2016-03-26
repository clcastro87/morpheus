/**
 * Generates API service output
 *
 * @author: Carlos Luis Castro Márquez
 * @copyright: Spissa Software Solutions
 * @date: 03/07/2015
 */
(function (response) {
    'use strict';

    // Module exports
    response.success = success;
    response.error = error;
    response.makeResponse = makeResponse;
    response.fromCallback = fromCallback;

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
     * @param: result Object to put in response.result
     * @param: code Error code. It could be a HTTP status code.
     * @param: description Error description. It could be a HTTP status description.
     * */
    function makeResponse(result, code, description) {
        return {
            status: {
                code: code || 200,
                description: description || 'success'
            },
            result: result === undefined ? {} : result
        };
    }

    /**
     * Builds an automatic response based on common callback response function.
     * If an error is sent as first parameter, then is a response error,
     * otherwise returns a success response.
     *
     * @param: err Callback error.
     * @param: result Callback result.
     * */
    function fromCallback(err, result) {
        if (err) {
            return error(err.statusCode || 500, err.message || 'Internal Server Error');
        }
        return success(result);
    }

})(module.exports);
