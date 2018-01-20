var fs = require('fs');

exports.callbackTest = function (req, res, next) {
    var callback = function(done) {
        done(null, {hello: 'world'});
    };
    res.dispatch(callback);
};

exports.callbackTestError = function (req, res, next) {
    var callback = function(done) {
        done(new Error('Upps!!, I got an error'));
    };
    res.dispatch(callback);
};
