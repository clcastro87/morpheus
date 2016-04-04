/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var Promise = require('bluebird');

exports.hello = function (req, res, next) {
    //res.send('aaaaaaaaaaa');

    function test(done) {
        done(null, {hello: 'world'});
    }

    res.dispatch(new Promise(function (resolve, reject) {
        //reject(new Error('Hoa'));
        resolve({pepe: 'lola'});
    }));
    //res.dispatch(new Error('nsnsnsns'));
    //next(new Error('aaa'));
    //next();
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
