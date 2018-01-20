var Promise = require('bluebird');
var Controller = require('../../index').Controller;

function HomeController(router) {
    Controller.call(this, router);
}

HomeController.prototype.get = function() {
    return {hola: 'Mundodddd'};
}

HomeController.prototype.getItem = function(id) {
    var promise = new Promise(function (resolve, reject) {
        resolve({hola: id});
    });

    return promise;
}


module.exports = HomeController;