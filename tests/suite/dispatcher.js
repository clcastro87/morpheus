var expect = require('chai').expect;
var Dispatcher = require('../../src/lib/dispatcher');
var errorHandler = require('../../src/lib/errorHandler');
var Status = require('../../index').Status;
var Response = require('../mocks/response');
var Promise = require('bluebird');

describe('Dispatcher middleware', function () {

    describe('Core', function () {
        it('Middleware constructor', function () {
            expect(Dispatcher).to.not.null();
            expect(Dispatcher).to.be.a('function');
            var middleware = new Dispatcher({});
            expect(middleware).to.not.null();
            expect(middleware).to.be.a('function');
        });

        it('Middleware call', function () {
            expect(Dispatcher).to.not.null();
            expect(Dispatcher).to.be.a('function');
            var middleware = new Dispatcher({});
            expect(middleware).to.not.null();
            expect(middleware).to.be.a('function');
            var res = new Response();
            middleware.call(middleware, {}, res, function (){});
            expect(res).to.respondTo('dispatch');
        });
    });

    describe('Http Status', function () {
        it('Dispatch OK', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (){});
            expect(res).to.respondTo('dispatch');
            res.dispatch();
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(200);
            expect(res.statusMessage).to.be.eql('OK');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(200);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.null();
        });
        it('Dispatch Created', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');
            res.dispatch(Status.CREATED);
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(201);
            expect(res.statusMessage).to.be.eql('Created');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(201);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.null();
        });
    });

    describe('Sync Responses', function () {
        it('Dispatch Object', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (){});
            expect(res).to.respondTo('dispatch');
            res.dispatch({hello: 'World'});
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(200);
            expect(res.statusMessage).to.be.eql('OK');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(200);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.not.null();
            expect(jsForm.result).to.be.an('object');
            expect(jsForm.result).to.have.property('hello').and.equal('World');
        });

        it('Dispatch error', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');
            res.dispatch(new Error("This is an error."));
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(500);
            expect(res.statusMessage).to.be.eql('Internal Server Error');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(500);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.null();
        });
    });

    describe('Async Callback Responses', function (){
        it('Dispatch Callback Result', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');
            res.dispatch(function (done) {
                done(null, {hello: 'World'});
            });
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(200);
            expect(res.statusMessage).to.be.eql('OK');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(200);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.not.null();
            expect(jsForm.result).to.be.an('object');
            expect(jsForm.result).to.have.property('hello').and.equal('World');
        });

        it('Dispatch Callback Error', function () {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');
            res.dispatch(function (done) {
                done(new Error("This is an error."));
            });
            expect(res).to.be.an('object');
            expect(res.headersSent).to.be.eql(true);
            expect(res.statusCode).to.be.eql(500);
            expect(res.statusMessage).to.be.eql('Internal Server Error');
            var content = res.content;
            expect(content).to.not.null();
            var jsForm = JSON.parse(content);
            expect(jsForm).to.be.an('object');
            expect(jsForm.status).to.be.an('object');
            expect(jsForm.status.code).to.be.eql(500);
            expect(jsForm.status.description).to.not.null();
            expect(jsForm.result).to.null();
        });
    });

    describe('Async Promise Responses', function () {
        it('Dispatch Promise Result', function (done) {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');

            var promise = new Promise(function (resolve, reject) {
                resolve({hello: 'World'});
            });
            promise.then(function() {
                setTimeout(function () {
                    var resp = {
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        content: res.content,
                        headersSent: res.headersSent
                    };
                    expect(resp).to.be.an('object');
                    expect(resp.headersSent).to.be.eql(true);
                    expect(resp.statusCode).to.be.eql(200);
                    expect(resp.statusMessage).to.be.eql('OK');
                    var content = resp.content;
                    expect(content).to.not.null();
                    var jsForm = JSON.parse(content);
                    expect(jsForm).to.be.an('object');
                    expect(jsForm.status).to.be.an('object');
                    expect(jsForm.status.code).to.be.eql(200);
                    expect(jsForm.status.description).to.not.null();
                    expect(jsForm.result).to.not.null();
                    expect(jsForm.result).to.be.an('object');
                    expect(jsForm.result).to.have.property('hello').and.equal('World');
                    done();
                }, 3);
            });
            res.dispatch(promise);
        });

        it('Dispatch Promise Error', function (done) {
            var middleware = new Dispatcher({});
            var res = new Response();
            middleware.call(middleware, {}, res, function (err) {
                if (err instanceof Error) {
                    errorHandler.call(errorHandler, err, {}, res, function (){});
                }
            });
            expect(res).to.respondTo('dispatch');

            var promise = new Promise(function (resolve, reject) {
                reject(new Error("This is an error."));
            });
            promise.catch(function() {
                setTimeout(function () {
                    var resp = {
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        content: res.content,
                        headersSent: res.headersSent
                    };
                    expect(resp).to.be.an('object');
                    expect(resp.headersSent).to.be.eql(true);
                    expect(resp.statusCode).to.be.eql(500);
                    expect(resp.statusMessage).to.be.eql('Internal Server Error');
                    var content = res.content;
                    expect(content).to.not.null();
                    var jsForm = JSON.parse(content);
                    expect(jsForm).to.be.an('object');
                    expect(jsForm.status).to.be.an('object');
                    expect(jsForm.status.code).to.be.eql(500);
                    expect(jsForm.status.description).to.not.null();
                    expect(jsForm.result).to.null();
                    done();
                }, 3);
            });
            res.dispatch(promise);
        });
    });
});
