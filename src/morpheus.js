// External modules
var express = require('express');
var _ = require('lodash');
var cache = require('express-cache-ctrl');
var compression = require('compression');
var helmet = require('helmet');
var cors = require('cors');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// Local modules
var errorHandler = require('./lib/errorHandler');
var notFound = require('./lib/notFound');
var dispatcher = require('./lib/dispatcher');

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

function setBodyParser(app, options) {
    var defaultOptions = {
        json: {
            limit: '100kb',
            strict: true
        },
        urlencoded: {
            extended: true,
            limit: '100kb',
            parameterLimit: 150
        }
    };
    var currentOptions = _.defaults(options || {}, defaultOptions);
    Object.keys(currentOptions).forEach(function (key) {
        var parserOptions = currentOptions[key];
        if (!!parserOptions) {
            app.use(bodyParser[key](parserOptions));
        }
    });
}

function setMethodOverride(key) {
    if (key === false) {
        return function (req, res, next) {
            next();
        };
    }
    if (key === true) {
        key = '_method';
    }
    return methodOverride(key);
}

function useControllers(path) {
    var fs = require('fs');
    var rPath = fs.realpathSync(path);
    var files = fs.readdirSync(rPath);

    var router = express.Router();

    for (var i = 0; i < files.length; i++) {
        var cPath = fs.realpathSync(rPath + '/' + files[i]);
        // TODO: Filter js files
        var Ctrl = require(cPath);
        /* jshint -W031 */
        new Ctrl(router);
    }

    return router;
}

function morpheus(options) {

    options = options || {};

    /* jshint -W055 */
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

    // Set body parser
    setBodyParser(app, options.bodyParser);

    // Set method override
    app.use(setMethodOverride(options.methodOverride));

    // Set dispatcher
    app.use(dispatcher());

    // Set inner router
    var router = express.Router();
    app.use(router);

    // Set 404
    app.use(notFound);
    // Set error handler
    app.use(errorHandler);

    return {app: app, router: router, useControllers: useControllers};
}

// Module exports
module.exports = exports = morpheus;
exports.cache = cache;
exports.compression = compression;
exports.helmet = helmet;
exports.cors = cors;
exports.bodyParser = bodyParser;
exports.methodOverride = methodOverride;
exports.Controller = require('./lib/controller');
exports.Status = require('./lib/status');
