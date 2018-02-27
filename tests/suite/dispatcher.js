var expect = require('chai').expect;
var Dispatcher = require('../../src/lib/dispatcher');
var errorHandler = require('../../src/lib/errorHandler');
var Response = require('../mocks/response');

describe('Dispatcher middleware', function () {

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

    it('Dispatch hello', function () {
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

    /*it('Middleware invoke', function () {
        expect(errorHandler).to.not.null();
        expect(errorHandler).to.be.a('function');
        var res = new Response();
        var err = new Error('Test error');
        errorHandler.call(errorHandler, err, {}, res);
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
    });*/
});
