exports.hello = function (req, res, next) {
    res.dispatch({hello: 'World'});
 }

exports.exception = function (req, res, next) {
    throw new Error("This is an error");
};

exports.exception2 = function (req, res, next) {
    res.dispatch(new Error("This is an error too."));
};
