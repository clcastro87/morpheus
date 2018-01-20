/**
 * Copyright 2016
 * Created by Carlos on 4/3/2016.
 */

var morpheus = require('../../index');
var api = morpheus();
var router = api.router;

var helloController = require('../controllers/hello');
router.get('/hello', morpheus.cache.public(3600), helloController.promiseHello);
router.get('/exception', helloController.exception);
router.post('/hello', helloController.postTest);
router.put('/hello', helloController.putTest);

module.exports = api.app;
