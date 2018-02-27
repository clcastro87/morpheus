var expect = require('chai').expect;
var notFound = require('../../src/lib/notFound');
var Response = require('../mocks/response');

describe('Not found middleware', function () {

    it('Middleware invoke', function () {
        expect(notFound).to.not.null();
        expect(notFound).to.be.a('function');
        var res = new Response();
        notFound.call(notFound, {}, res);
        expect(res).to.be.an('object');
        expect(res.headersSent).to.be.eql(true);
        expect(res.statusCode).to.be.eql(404);
        expect(res.statusMessage).to.be.eql('Not Found');
        var content = res.content;
        expect(content).to.not.null();
        var jsForm = JSON.parse(content);
        expect(jsForm).to.be.an('object');
        expect(jsForm.status).to.be.an('object');
        expect(jsForm.status.code).to.be.eql(404);
        expect(jsForm.status.description).to.not.null();
        expect(jsForm.result).to.null();
    });
});
