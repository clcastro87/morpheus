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
    props.forEach(route);

    function route(prop) {
        debug('Registering route for fn: ' + prop);
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
        url += params.map((p) => '/:' + p).join('');
        debug('register route for verb: ' + method + ', url = ' + url);
        router[method](url, function (req, res, next) {
            var vals = params.map(p => req.params[p]);
            debug('Dispatching request to: ' + className + '/' + prop + ', with params: ' + vals);
            res.dispatch(classProto[prop].apply({request: req, response: res}, vals));
        });
    }
}

module.exports = Controller