'use strict';

const DEBUG_SIGNATURE = 'morpheus.controller';
var debug = require('debug')(DEBUG_SIGNATURE);
var helpers = require('../helpers');

var conventions = {
    'camel': helpers.toCamelCase,
    'kebab': helpers.toKebabCase,
    'snake': helpers.toSnakeCase
};

function Controller(router, config) {
    // Setting up configuration defaults
    config = config || {};
    // Convention configuration
    config.convention = config.convention || 'camel';
    var conventionFn = conventions[config.convention] || conventions['camel'];
    // Getting prototype
    var classProto = Object.getPrototypeOf(this);
    // Getting class name
    var className = classProto['constructor'].name;
    debug('Registering controller for class: ' + className);
    // Extract route
    // First removing ending phrase Controller
    var controlRoute = className.replace(/Controller$/, '');
    // Apply convention to route primary name
    controlRoute = conventionFn(controlRoute);
    // Setting up base route
    var baseRoute = '/' + controlRoute;
    debug('Registering controller base route: ' + baseRoute);
    // Obtain controller properties
    var props = Object.getOwnPropertyNames(classProto);
    // Keep only functions
    props = props.filter(ignoreNonFunctions);
    // Try to route function to
    var routeMappings = props.map(mapPropToRoute);
    // Organize route mapping to avoid params and route overlapping
    routeMappings = routeMappings.sort(intelligentRouteSort);
    // Push into express router
    routeMappings.forEach(enroute);

    function ignoreNonFunctions(p) {
        // if property is constructor ignore it
        if (p === 'constructor') {
            return false;
        }
        // return if property is a function
        return (typeof classProto[p] === 'function');
    }

    function intelligentRouteSort(r1, r2) {
        // if r1 doesn't have params asc
        if (!r1.params || !r1.params.length) {
            return -1;
        }
        // if r2 doesn't have params desc
        if (!r2.params || !r2.params.length) {
            return 1;
        }
        // if r1 and r1 have same params count order is insignificant
        if (r1.params.length === r2.params.length) {
            return 0;
        }
        // return the prop with less params
        return r1.params.length > r2.params.length ? -1 : 1;
    }

    function mapPropToRoute(prop) {
        debug('Generating route for fn: ' + prop);
        var methods = ['get', 'post', 'put', 'delete'];
        var method = 'get';
        var routeAddition = '';
        if (methods.indexOf(prop) >= 0) {
            method = prop;
        }
        else if (prop === 'getItem') {
            method = 'get';
        }
        else {
            // for now
            routeAddition = '/' + conventionFn(prop);
        }
        var fnDec = classProto[prop].toString();
        var paramsMatch = fnDec.match(/\(([\w,\s]*)\)/);
        var params = (paramsMatch && paramsMatch.index && paramsMatch[1]) ? paramsMatch[1].split(/\s*,\s*/) : [];
        var url = baseRoute + routeAddition;
        return {
            url: url += makeParamsDef(params),
            params: params,
            method: method,
            prop: prop
        };
    }

    function makeParamsDef(params) {
        return params.map(function (p) {
            return '/:' + p;
        })
        .join('');
    }

    function enroute(routeDef) {
        debug('register route for verb: ' + routeDef.method + ', url = ' + routeDef.url);
        router[routeDef.method](routeDef.url, function (req, res, next) {
            var vals = routeDef.params.map(function (p) {
                return req.params[p];
            });
            debug('Dispatching request to: ' + className + '/' + routeDef.prop + ', with params: ' + vals);
            res.dispatch(classProto[routeDef.prop].apply({request: req, response: res}, vals));
        });
    }
}

module.exports = Controller;
