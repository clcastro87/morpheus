'use strict';

// Module requires
var winston = require('winston');
var path = require('path');
var config = require('./config');
var _ = require('lodash');
var helpers = require('../helpers');

// Default logger configuration
var defaultConfig = {
    transports: {
        console: {
            colorize: true,
            level: 'warn'
        }
    }
};

/**
 * Generates a logger for specific module, or specified name.
 *  Ex:
 *    var logger = require('./logger')(module); or
 *    var logger = require('./logger')('core');
 *
 * @author: Carlos Luis Castro Márquez
 * @date: 03/07/2015
 */
function getLogger(module) {
    // Set default namespace.
    var namespace = 'common';
    // If module variable set.
    if (module) {
        // If it is a module then use it filename.
        if (module.filename) {
            namespace = module.filename;
            // Get proper filename separator
            var char = path.sep;
            // Only takes the last two levels in file structure
            namespace = namespace
                .split(char)
                .slice(-2)
                .join(char);
        }
        // Otherwise use string representation of the value.
        else {
            namespace = module.toString();
        }
    }

    // Returns winston logger.
    return new winston.Logger(getConfiguration(namespace));
}

function getConfiguration(label) {
    var loggerConfig = config.instance.current.get('logger', defaultConfig);
    return buildConfiguration(label, loggerConfig);
}

function buildConfiguration(label, loggerConfig) {
    var transports = loggerConfig.transports;
    var realTransports = [];
    for (var transport in transports) {
        if (!transports.hasOwnProperty(transport)) {
            continue;
        }
        var transportConfig = _.merge({}, transports[transport], {label: label || 'core'});
        var transportKey = helpers.capitalize(transport);
        var Transport = winston.transports[transportKey];
        if (!Transport) {
            throw new Error('Transport \'' + transportKey + '\' not found!');
        }
        realTransports.push(new Transport(transportConfig));
    }
    return _.merge({}, loggerConfig, {transports: realTransports});
}

// Module exports
module.exports = exports = getLogger;
exports._getConfiguration = getConfiguration;
exports._buildConfiguration = buildConfiguration;
