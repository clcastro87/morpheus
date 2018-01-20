var Controller = require('../../index').Controller;

function HomeController(router) {
    Controller.call(this, router);
}

HomeController.prototype.get = function() {
    return {hola: 'Mundodddd'};
}

HomeController.prototype.getItem = function(id) {
    return {hola: id};
}


module.exports = HomeController;