'use strict';
function Controller(router) {
    var classProto = Object.getPrototypeOf(this);
    var className = classProto['constructor'].name;
    var controlRoute = className.toLowerCase();
    if (className.indexOf('Controller') !== -1) {
        controlRoute = className.substring(0, className.indexOf('Controller')).toLowerCase();
    }
    var baseRoute = '/' + controlRoute;
    var props = Object.getOwnPropertyNames(classProto);
    props = props.filter((p) => {
        if (p === 'constructor')
            return false;
        return (typeof classProto[p] == 'function');
    });

    for (var i = 0; i < props.length; i++) {
        route(props[i]);
    }

    function route(prop) {
        // TODO: Camelcasing fix
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
            routeAddition = '/' + prop;
        }
        var fnDec = classProto[prop].toString();
        var paramsMatch = fnDec.match(/\(([\w,\s]+)\)/);
        var params = (paramsMatch && paramsMatch.index && paramsMatch[1]) 
            ? paramsMatch[1].split(/\s*,\s*/) 
            : [];
        var url = baseRoute + routeAddition;
        url += params.map((p) => '/:' + p).join('');
        console.log('register route for:', method, url);
        router[method](url, function (req, res, next) {
            var vals = params.map(p => req.params[p]);
            res.dispatch(classProto[prop].apply({request: req, response: res}, vals));
        });
    }
}

module.exports = Controller