/**
 * Allows to handle json a configuration file.
 *
 * @author: Carlos Luis Castro Márquez
 * @date: 03/26/2016
 */
'use strict';
var DEBUG_SIGNATURE = 'morpheus.config';

// Module requires
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')(DEBUG_SIGNATURE);
var path = require('path');

/**
 * It's a prototype to handle configuration settings for a particular environment.
 *
 * @type {Configuration}
 * @param {Object} defaults Object with default values for configuration.
 * */
function Configuration(defaults) {
    defaults = defaults || {};
    for (var field in defaults) {
        if (defaults.hasOwnProperty(field)) {
            this[field] = defaults[field];
        }
    }
}

/**
 * Gets configuration value with default value.
 *
 * @param {String} key Configuration field.
 * @param {Object | String | Number} defaultValue If key is not defined, this value is returned.
 * @returns {Object | String | Number} Configuration value.
 * */
Configuration.prototype.get = function (key, defaultValue) {
    debug('Getting value for key:', key);
    if (defaultValue) {
        debug('Default value for key:', defaultValue);
    }
    return (this[key] || defaultValue);
};

/**
 * It's a prototype to handle several configuration settings according to its specific environment.
 *
 * @type {ConfigurationManager}
 * */
function ConfigurationManager() {
    this.configurations = {};
    this.environment = (process.env && process.env.NODE_ENV) || 'development';
    this.configurations[this.environment] = new Configuration();
    debug('Creating ConfigurationManager');
    debug('Current environment:', this.environment);
}

var currentProperty = {
    enumerable: true,
    configurable: true,
    get: function () {
        debug('Getting current configuration.');
        return this.configurations[this.environment];
    },
    set: function (configuration) {
        debug('Setting current configuration.');
        this.configurations[this.environment] = configuration instanceof Configuration ? configuration
            : new Configuration(configuration);
    }
};

Object.defineProperty(ConfigurationManager.prototype, 'current', currentProperty);

/**
 * Save configuration file (Sync).
 *
 * @param {String} filePath File path to save configuration.
 * */
ConfigurationManager.prototype.saveSync = function (filePath) {
    // Select data to save.
    var data2Save = this.configurations;
    // Write file then, if callback, return when finished.
    fs.writeFileSync(filePath, JSON.stringify(data2Save, null, '  '));
};

/**
 * Save configuration file.
 *
 * @param {String} filePath File path to save configuration.
 * @param {Function} callback Callback with result.
 * */
ConfigurationManager.prototype.save = function (filePath, callback) {
    // Set default value for callback.
    callback = callback || function () {
        };
    // Select data to save.
    var data2Save = this.configurations;
    // Know saving path.
    fs.realpath(filePath, function (err, savePath) {
        if (err) {
            return callback(err);
        }
        // Write file then, if callback, return when finished.
        fs.writeFile(savePath, JSON.stringify(data2Save, null, '  '), callback);
    });
};

/**
 * Open configuration file. (Sync)
 *
 * @param {String} filePath Configuration file path.
 * */
ConfigurationManager.prototype.openSync = function (filePath) {
    // Know saving path.
    var openPath = fs.realpathSync(filePath);
    // Check if file exists and permissions
    /* jshint -W016 */
    fs.accessSync(openPath, (fs.F_OK | fs.R_OK));
    // Read configuration
    var allConfigurations = require(openPath);
    // Setup configurations
    this._setupConfigurations(allConfigurations);
    return this.current;
};

/**
 * Open configuration file.
 *
 * @param {String} filePath Configuration file path.
 * @param {Function} callback Callback with result.
 * */
ConfigurationManager.prototype.open = function (filePath, callback) {
    // Set default value for callback.
    callback = callback || function () {
        };
    // Save instance reference
    var self = this;
    // Know saving path.
    fs.realpath(filePath, function (err, openPath) {
        if (err) {
            return callback(err);
        }
        try {
            // Check if file exists and the process is able to read it.
            /* jshint -W016 */
            fs.access(openPath, fs.F_OK | fs.R_OK, function (err) {
                if (err) {
                    return callback(err);
                }
                // Read configuration
                var allConfigurations = require(openPath);
                // Setup configurations
                self._setupConfigurations(allConfigurations);
                callback(null, self.current);
            });
        }
        catch (err) {
            callback(err);
        }
    });
};

/**
 * Setup configuration environments. (Sync)
 *
 * @param {Object} configurations Object with configuration environment settings.
 * */
ConfigurationManager.prototype._setupConfigurations = function (configurations) {
    var defaultEnv = 'default';
    var defaultConfig = {};
    if (configurations.hasOwnProperty(defaultEnv)) {
        defaultConfig = configurations[defaultEnv];
    }
    for (var env in configurations) {
        if (configurations.hasOwnProperty(env)) {
            var environmentConfig = _.merge({}, defaultConfig, configurations[env]);
            this.configurations[env] = new Configuration(environmentConfig);
        }
    }
};

/**
 * Initialize a Configuration Manager. (Sync)
 *
 * @param {String} filePath Path to configuration file.
 * */
function initialize(filePath) {
    filePath = filePath || path.join(process.cwd(), '/config.json');
    var manager = new ConfigurationManager();
    manager.openSync(filePath);
    return manager;
}

// Module exports
module.exports = exports = ConfigurationManager;
exports.Configuration = Configuration;
exports.ConfigurationManager = ConfigurationManager;
exports.initialize = initialize;
exports.instance = _.once(initialize)(path.join(process.cwd() + '/config.json'));

