/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

exports.promiseHello = function (req, res, next) {
    var Promise = require('bluebird');

    var promise = new Promise(function (resolve, reject) {
        //reject(new Error('Hoa'));
        resolve({hello: 'world'});
    });
    res.dispatch(promise);
};

exports.promiseHelloError = function (req, res, next) {
    var Promise = require('bluebird');

    var promise = new Promise(function (resolve, reject) {
        reject(new Error('Upps!!, I got an error'));
    });
    res.dispatch(promise);
};

exports.exception = function (req, res, next) {
    throw new Error("This is an error");
};

exports.postTest = function (req, res, next) {

    function test(done) {
        done(null, {hello: req.body});
    }

    res.dispatch(test);
};


exports.putTest = function (req, res, next) {

    function test(done) {
        done(null, {put: req.body});
    }

    res.dispatch(test);
};
