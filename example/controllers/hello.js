/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

 exports.hello = function (req, res, next) {
    res.dispatch({hello: 'World'});
 }

 exports.exception = function (req, res, next) {
    throw new Error("This is an error");
};
