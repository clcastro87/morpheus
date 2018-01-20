
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
        return !(typeof classProto[p] == 'Function');
    });

    for (var i = 0; i < props.length; i++) {
        route(props[i]);
    }

    function route(prop) {
        var methods = ['get', 'post', 'put', 'del'];
        var method = 'get';
        var routeAddition = '';
        if (methods.indexOf(prop) >= 0) {
            method = prop;
        }
        else {
            // for now
            routeAddition = '/' + prop;
        }
        console.log('register route for:', method, baseRoute + routeAddition);
        router[method](baseRoute + routeAddition, function (req, res, next) {
            // TODO: params are missing
            var params = [];
            res.dispatch(classProto[prop].apply({request: req, response: res}, params));
        });
    }
}

module.exports = Controller