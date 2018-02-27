var Promise = require('bluebird');
var Controller = require('../../index').Controller;

function CustomNameController(router, config) {
    Controller.call(this, router, config);
}

CustomNameController.prototype.get = function() {
    return {hola: 'Mundodddd'};
};

CustomNameController.prototype.getItem = function(id) {
    var request = this.request;
    var promise = new Promise(function (resolve, reject) {
        resolve({hola: id, q: request.query});
    });

    return promise;
};

CustomNameController.prototype.post = function() {
    return this.request;
};

CustomNameController.prototype.put = function(id) {
    return this.request;
};

CustomNameController.prototype.delete = function(id) {
    return this.request;
};

CustomNameController.prototype.findUser = function() {
    var request = this.request;
    var name = request.query.name || '';
    var promise = new Promise(function (resolve, reject) {
        resolve({username: name});
    });

    return promise;
};

module.exports = CustomNameController;
