var expect = require('chai').expect;
var response = require('../../src/lib/response');
var Status = require('../../index').Status;

describe.only('Response Handler', function () {

    describe('constructor', function () {
        expect(response).to.not.null();
        expect(response).to.be.a('object');
        expect(response).to.have.property('success');
        expect(response).to.have.property('error');
        expect(response).to.have.property('makeResponse');
        expect(response).to.have.property('fromHttpStatus');
    });

    describe('#makeResponse()', function () {
        it('check undefined result', function () {
            var result = response.makeResponse(undefined, 201, 'Created');
            expect(result).to.be.a('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(201);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'Created');
            expect(result.result).to.null();
        });

        it('check object result', function () {
            var result = response.makeResponse({hello: 'World'}, 200, 'OK');
            expect(result).to.be.an('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(200);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'OK');
            expect(result.result).to.not.null();
            expect(result.result).to.be.an('object');
            expect(result.result).to.have.property('hello', 'World');
        });
    });

    describe('#success()', function () {
        it('check object result', function () {
            var result = response.success({hello: 'World'});
            expect(result).to.be.an('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(200);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'OK');
            expect(result.result).to.not.null();
            expect(result.result).to.be.an('object');
            expect(result.result).to.have.property('hello', 'World');
        });
    });

    describe('#error()', function () {
        it('check error with code', function () {
            var result = response.error(404, 'Not Found');
            expect(result).to.be.a('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(404);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'Not Found');
            expect(result.result).to.null();
        });
    });

    describe('#fromHttpStatus()', function () {
        it('check with empty result', function () {
            var result = response.fromHttpStatus(Status.FORBIDDEN);
            expect(result).to.be.a('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(403);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'Forbidden');
            expect(result.result).to.null();
        });
        it('check with object result', function () {
            var result = response.fromHttpStatus(Status.OK, {hello: 'World'});
            expect(result).to.be.a('object');
            expect(result).to.have.property('status');
            expect(result).to.have.property('result');
            expect(result.status).to.be.an('object');
            expect(result.status.code).to.be.eql(200);
            expect(result.status.description).to.not.null();
            expect(result.status).to.have.property('description', 'OK');
            expect(result.result).to.not.null();
            expect(result.result).to.be.an('object');
            expect(result.result).to.have.property('hello', 'World');
        });
    });

});
