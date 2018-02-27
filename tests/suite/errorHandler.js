var expect = require('chai').expect;
var errorHandler = require('../../src/lib/errorHandler');
var Response = require('../mocks/response');

describe('Error middleware', function () {

    it('Middleware invoke', function () {
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
    });
});
