/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var morpheus = require('../../index');
var api = morpheus();
var router = api.router;

var helloController = require('../controllers/hello');
router.get('/hello', morpheus.cache.public(3600), helloController.hello);
router.get('/exception', helloController.exception);

var promiseController = require('../controllers/promise');
router.get('/promise/test', promiseController.promiseTest);
router.get('/promise/error', promiseController.promiseTestError);

module.exports = api.app;
