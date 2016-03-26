var expect = require('chai').expect;
var cache = require('../../src/lib/cache');
var Response = require('../mocks/response');

describe('Cache Middleware', function () {

    var ttl = 3600;

    it('cache disabled', function (done) {
        var res = new Response();
        var middleware = cache.disabled();
        expect(middleware).to.not.null();
        expect(middleware).to.be.a('function');
        middleware.call(middleware, {}, res, function () {
            var cacheControl = res.get('Cache-Control');
            expect(cacheControl).to.not.null();
            var controls = cacheControl.split(', ');
            expect(controls).to.be.an('array');
            expect(controls).to.include.members(['no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate']);
            var pragma = res.get('Pragma');
            expect(pragma).to.not.null();
            expect(pragma).to.equal('no-cache');
            done();
        });
    });

    it('cache private', function (done) {
        var res = new Response();
        var middleware = cache.private(ttl);
        expect(middleware).to.not.null();
        expect(middleware).to.be.a('function');
        middleware.call(middleware, {}, res, function () {
            var cacheControl = res.get('Cache-Control');
            expect(cacheControl).to.not.null();
            var controls = cacheControl.split(', ');
            expect(controls).to.be.an('array');
            expect(controls.length).to.be.eql(2);
            expect(controls[0]).to.equal('private');
            expect(controls[1]).to.equal(ttl.toString());
            var pragma = res.get('Pragma');
            expect(pragma).to.be.an('undefined');
            done();
        });
    });

    it('cache public', function (done) {
        var res = new Response();
        var middleware = cache.public(ttl);
        expect(middleware).to.not.null();
        expect(middleware).to.be.a('function');
        middleware.call(middleware, {}, res, function () {
            var cacheControl = res.get('Cache-Control');
            expect(cacheControl).to.not.null();
            var controls = cacheControl.split(', ');
            expect(controls).to.be.an('array');
            expect(controls.length).to.be.eql(2);
            expect(controls[0]).to.equal('public');
            expect(controls[1]).to.equal(ttl.toString());
            var pragma = res.get('Pragma');
            expect(pragma).to.be.an('undefined');
            done();
        });
    });

    it('cache default', function (done) {
        var res = new Response();
        var middleware = cache.default(ttl);
        expect(middleware).to.not.null();
        expect(middleware).to.be.a('function');
        middleware.call(middleware, {}, res, function () {
            var cacheControl = res.get('Cache-Control');
            expect(cacheControl).to.not.null();
            var controls = cacheControl.split(', ');
            expect(controls).to.be.an('array');
            expect(controls[0]).to.equal('private');
            expect(controls).to.include.members(['no-store']);
            expect(controls[controls.length - 1]).to.equal(ttl.toString());
            var pragma = res.get('Pragma');
            expect(pragma).to.be.an('undefined');
            done();
        });
    });
});
