'use strict';

const DEBUG_SIGNATURE = 'morpheus.controller';
var debug = require('debug')(DEBUG_SIGNATURE);
var helpers = require('../helpers');

function Controller(router) {
    var classProto = Object.getPrototypeOf(this);
    var className = classProto['constructor'].name;
    debug('Registering controller for class: ' + className);
    var controlRoute = className.toLowerCase();
    if (className.indexOf('Controller') !== -1) {
        controlRoute = className.substring(0, className.indexOf('Controller')).toLowerCase();
    }
    var baseRoute = '/' + controlRoute;
    debug('Registering controller base route: ' + baseRoute);
    var props = Object.getOwnPropertyNames(classProto);
    props = props.filter((p) => {
        if (p === 'constructor')
            return false;
        return (typeof classProto[p] == 'function');
    });
    
    var routeMappings = props.map(mapPropToRoute);
    routeMappings = routeMappings.sort(rm => rm.params && rm.params.length);
    routeMappings.forEach(enroute);

    function mapPropToRoute(prop) {
        debug('Generating route for fn: ' + prop);
        var methods = ['get', 'post', 'put', 'del'];
        var method = 'get';
        var routeAddition = '';
        if (methods.indexOf(prop) >= 0) {
            method = prop;
        }
        else if (prop == 'getItem') {
            method = 'get';
        }
        else {
            // for now
            routeAddition = '/' + helpers.toCamelCase(prop);
        }
        var fnDec = classProto[prop].toString();
        var paramsMatch = fnDec.match(/\(([\w,\s]*)\)/);
        var params = (paramsMatch && paramsMatch.index && paramsMatch[1]) 
            ? paramsMatch[1].split(/\s*,\s*/) 
            : [];
        var url = baseRoute + routeAddition;
        return {
            url: url += params.map((p) => '/:' + p).join(''),
            params: params,
            method: method,
            prop: prop
        }
    }

    function enroute(routeDef) {
        debug('register route for verb: ' + routeDef.method + ', url = ' + routeDef.url);
        router[routeDef.method](routeDef.url, function (req, res, next) {
            var vals = routeDef.params.map(p => req.params[p]);
            debug('Dispatching request to: ' + className + '/' + routeDef.prop + ', with params: ' + vals);
            res.dispatch(classProto[routeDef.prop].apply({request: req, response: res}, vals));
        });
    }
}

module.exports = Controller