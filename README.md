# morpheus

[//]: # [![NPM Version][npm-image]][npm-url]
[//]: # [![NPM Downloads][downloads-image]][downloads-url]

[![Build Status](https://travis-ci.org/clcastro87/morpheus.svg?branch=master)](https://travis-ci.org/clcastro87/morpheus)
[![Issues](https://img.shields.io/github/issues/clcastro87/morpheus.svg)](https://travis-ci.org/clcastro87/morpheus)
[![GitHub forks](https://img.shields.io/github/forks/clcastro87/morpheus.svg)](https://github.com/clcastro87/morpheus/network)
[![GitHub stars](https://img.shields.io/github/stars/clcastro87/morpheus.svg)](https://github.com/clcastro87/morpheus/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/clcastro87/morpheus/master/LICENSE)

[Express](http://expressjs.com/) pluggable REST API, built in the right way. It always use a common convention in API responses, making the usage ideal for fast and secure development. You can use Promises, Callbacks, all what you want in single method call. It also supports MVC, using fancy controllers.

## Features
- Express pluggable middleware.
- Common API response, using proper convention.
- Blazing fast development.
- Superb performance, due to its minimalist approach.
- Single point for responses, using dispatch method.
- Response support for plain objects, errors, callbacks and promises; suitable for all kind of servicing approach.
- Automatic exception capture, avoiding unexpected exceptions on production.
- High security with helmet support.
- Avoid all kind of chatty responses, hiding server tokens.
- Support for controllers, making architecture and maintenance better and frictionless.
- Understandable samples.

## Quick Start

```js
var morpheus = require('morpheus');
var api = morpheus();
var router = api.router;
var Promise = require('bluebird');

// Sample returning object
router.get('/hello', function (req, res, next) {
  res.dispatch({hello: 'World'});
});

// Sample returning exception
router.get('/error', function (req, res, next) {
  res.dispatch(new Error('Upps, this got an error.'));
});

// Exception capturing, what????
router.get('/exception', function (req, res, next) {
  throw new Error('Wow, this blows up.')
});

// Promise support, ohh this looks useful
router.get('/promise', function (req, res, next) {
  var promise = new Promise(function (resolve, reject) {
    resolve({hello: 'world'});
  });
  res.dispatch(promise);
});

// Support for legacy callbacks, uff I can't loose my async approach.
router.get('/callback', function (req, res, next) {
  var callback = function(done) {
    done(new Error('Upps!!, I got an error'));
  };
  res.dispatch(callback);
});

// And what about controllers???
router.use('/', api.useControllers(__dirname + '/../controllers'));
// You'll have to dig more on this documentation, and samples. What are you waiting for?

var app = express();
// Yes you can plugit in your express app, even in a route.
app.use('/api/v1', api.app);

app.listen(4000);
```

## Install

```bash
$ npm install morpheus
```

## API

```js
var morpheus = require('morpheus');
var api = morpheus();
```

### router

Returns the express router in which you must register the API routes.

#### Example
```js
var router = api.router;
router.get('/hello', function (req, res, next) {
  res.dispatch({hello: 'World'});
});
```

### Constructor ([options])

Returns morpheus object.

#### Options

`morpheus()` accepts these properties in the options object. 

##### poweredBy

Value for X-Powered-By header. Defaults to `false`.

##### compression

Options for `compression` module. Defaults to `false`, or compression disabled.

##### helmet

Options for `helmet` module. If `false` passed, helmet will be disabled. If `true` is passed helmet will be configured with helmet defaults. Otherwise helmet will be configured with your options.

##### cors

Options for `cors` module. Defaults to `false`, or cors disabled.

##### bodyParser

Options for `bodyParser` module. If configuration is specified it will be merged with morpheus default options described below.

```js
var defaultOptions = {
        json: {
            limit: '100kb',
            strict: true
        },
        urlencoded: {
            extended: true,
            limit: '100kb',
            parameterLimit: 150
        }
    };
```

##### methodOverride

Key to define header in which server must read real HTTP method to override actual method. It lets you use HTTP verbs such as PUT or DELETE in places you normally can't. Defaults to `_method`.

### router

Returns the express router in which you must register the API routes.

#### Example
```js
var router = api.router;
router.get('/hello', function (req, res, next) {
  res.dispatch({hello: 'World'});
});
```

### app

Returns an express app, to mount as middleware in route, or directly binds to interface.

#### Example
```js
var app = express();
app.use('/api/v1', api.app);
app.listen(4000);
```

### useControllers(controllersDir)

Returns a morpheus router, with routes mounted for controllers located in the specified directory. This method uses realpath for determining the correct path for looking out controllers. 

```js
router.use('/', api.useControllers(__dirname + '/controllers'));
```

#### Controller Example
```js
var Promise = require('bluebird');
var Controller = require('morpheus').Controller;

function HomeController(router) {
    Controller.call(this, router);
}

HomeController.prototype.get = function() {
    return {hello: 'World'};
}

HomeController.prototype.getItem = function(id) {
    var request = this.request;
    var promise = new Promise(function (resolve, reject) {
        resolve({hello: id, q: request.query});
    });

    return promise;
}

module.exports = HomeController;
```
## Tests

***This is a work in progress***

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## People

The original author of Morpheus is [Carlos Luis Castro Márquez](https://github.com/clcastro87)

## License

[MIT](LICENSE)