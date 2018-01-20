var Promise = require('bluebird');
var fs = require('fs');

exports.promiseTest = function (req, res, next) {
    var promise = new Promise(function (resolve, reject) {
        resolve({hello: 'world'});
    });
    res.dispatch(promise);
};

exports.promiseTestError = function (req, res, next) {
    var promise = new Promise(function (resolve, reject) {
        reject(new Error('Upps!!, I got an error'));
    });
    res.dispatch(promise);
};
