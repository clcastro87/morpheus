var morpheus = require('../../index');
var api = morpheus();
var router = api.router;

var helloRoutes = require('../routes/hello');
router.get('/hello', morpheus.cache.public(3600), helloRoutes.hello);
router.get('/exception', helloRoutes.exception);
router.get('/error', helloRoutes.exception2);

var promiseRoutes = require('../routes/promise');
router.get('/promise/test', promiseRoutes.promiseTest);
router.get('/promise/error', promiseRoutes.promiseTestError);

var callbackRoutes = require('../routes/callback');
router.get('/callback/test', callbackRoutes.callbackTest);
router.get('/callback/error', callbackRoutes.callbackTestError);

router.use('/', api.useControllers(__dirname + '/../controllers'));

module.exports = api.app;
