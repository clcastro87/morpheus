/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var express = require('express');
var errorHandler = require('./lib/errorHandler');
var notFound = require('./lib/notFound');
var dispatcher = require('./lib/dispatcher');
var cache = require('./lib/cache');
var compression = require('compression');
var helmet = require('helmet');
var cors = require('cors');

function setPoweredBy(poweredBy) {
    if (poweredBy) {
        return function hidePoweredBy(req, res, next) {
            res.setHeader('X-Powered-By', poweredBy);
            next();
        };
    }
    else {
        return function hidePoweredBy(req, res, next) {
            res.removeHeader('X-Powered-By');
            next();
        };
    }
}

function setCompression(options) {
    if (options === false) {
        return function (req, res, next) {
            next();
        };
    }
    return compression(options);
}

function setHelmet(options) {
    if (options === false) {
        return function (req, res, next) {
            next();
        };
    }
    if (options === true) {
        return helmet();
    }
    return helmet(options);
}

function setCrossOrigin(options) {
    if (!options) {
        return function (req, res, next) {
            next();
        };
    }
    if (options === true) {
        return cors();
    }
    return cors(options);
}

function morpheus(router, options) {
    options = options || {};

    // Create express app.
    var app = new express();

    // Set powered by
    app.use(setPoweredBy(options.poweredBy));

    // Set compression
    app.use(setCompression(options.compression));

    // Set helmet
    app.use(setHelmet(options.helmet));

    // Set cross origin
    app.use(setCrossOrigin(options.cors));

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
exports.compression = compression;
exports.helmet = helmet;
exports.cors = cors;
