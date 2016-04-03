var expect = require('chai').expect;
var Status = require('../../src/lib/status');

describe('Http Status Handler', function () {

    it('constructor default', function (done) {
        var httpStatus = new Status();
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code');
        expect(httpStatus).to.have.property('description');
        expect(httpStatus).to.have.property('code').and.equal(200);
        expect(httpStatus).to.have.property('description').and.equal('OK');
        done();
    });

    it('constructor with parameters', function (done) {
        var httpStatus = new Status(404, 'Not Found');
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code').and.equal(404);
        expect(httpStatus).to.have.property('description').and.equal('Not Found');
        done();
    });

    it('instance by http status code', function (done) {
        var httpStatus = Status.byCode(201);
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code');
        expect(httpStatus).to.have.property('description');
        expect(httpStatus).to.have.property('code').and.equal(201);
        expect(httpStatus).to.have.property('description').and.equal('Created');
        done();
    });

    it('instance toString method', function (done) {
        var httpStatus = Status.byCode(200);
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code');
        expect(httpStatus).to.have.property('description');
        expect(httpStatus).to.respondTo('toString');
        expect(httpStatus.toString()).to.be.eql(httpStatus.description);
        done();
    });

    it('status OK', function (done) {
        var httpStatus = Status.OK;
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code');
        expect(httpStatus).to.have.property('description');
        expect(httpStatus).to.have.property('code').and.equal(200);
        expect(httpStatus).to.have.property('description').and.equal('OK');
        done();
    });

    it('status ERROR', function (done) {
        var httpStatus = Status.INTERNAL_SERVER_ERROR;
        expect(httpStatus).to.not.null();
        expect(httpStatus).to.be.a('object');
        expect(httpStatus).to.have.property('code');
        expect(httpStatus).to.have.property('description');
        expect(httpStatus).to.have.property('code').and.equal(500);
        expect(httpStatus).to.have.property('description').and.equal('Internal Server Error');
        done();
    });
});
