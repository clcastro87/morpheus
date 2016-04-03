/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var express = require('express');
var errorHandler = require('./lib/errorHandler');
var notFound = require('./lib/notFound');
var dispatcher = require('./lib/dispatcher');
var cache = require('./lib/cache');

function morpheus(router, options) {
    var app = new express();
    // Set dispatcher
    app.use(dispatcher());

    // Set inner router
    app.use(router);

    // Set 404
    app.use(notFound);
    // Set error handler
    app.use(errorHandler);

    return app;
}

// Module exports
module.exports = exports = morpheus;
exports.cache = cache;
