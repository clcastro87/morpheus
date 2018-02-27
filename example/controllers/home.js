var Promise = require('bluebird');
var Controller = require('../../index').Controller;

function HomeController(router, config) {
    Controller.call(this, router, config);
}

HomeController.prototype.get = function() {
    return {hola: 'Mundodddd'};
};

HomeController.prototype.getItem = function(id) {
    var request = this.request;
    var promise = new Promise(function (resolve, reject) {
        resolve({hola: id, q: request.query});
    });

    return promise;
};

HomeController.prototype.testParam = function(id, mod) {
    var promise = new Promise(function (resolve, reject) {
        resolve({username: id, module: mod});
    });

    return promise;
};

HomeController.prototype.findUser = function() {
    var request = this.request;
    var name = request.query.name || '';
    var promise = new Promise(function (resolve, reject) {
        resolve({username: name});
    });

    return promise;
};

module.exports = HomeController;
