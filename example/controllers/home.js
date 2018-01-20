var Controller = require('../../index').Controller;

function HomeController(router) {
    Controller.call(this, router);
}

HomeController.prototype.get = function() {
    return {hola: 'Mundodddd'};
}

module.exports = HomeController;