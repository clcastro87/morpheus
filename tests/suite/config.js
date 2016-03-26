var expect = require('chai').expect;
var config = require('../../src/lib/config');
var configMock = require('../mocks/configuration');

describe('Configuration Manager', function () {

    var ConfigurationManager = config.ConfigurationManager;
    var Configuration = config.Configuration;
    var testFilePath = process.cwd() +  '/test.json';
    var configFilePath = process.cwd() +  '/config.json';

    it('Configuration constructor', function () {
        expect(Configuration).to.not.null();
        expect(Configuration).to.be.a('function');
        var instance = new Configuration('development', {foo: 'bar'});
        expect(instance).to.not.null();
        expect(instance).to.be.a('object');
        expect(instance).to.be.an.instanceOf(Configuration);
        expect(instance).to.have.property('environment').and.equal('development');
        expect(instance).to.have.property('foo').and.equal('bar');
        expect(instance).to.respondTo('get');
        expect(instance.get('foo')).to.be.eql('bar');
        expect(instance.get('fooz', 'baz')).to.be.eql('baz');
    });

    it('Manager constructor', function () {
        expect(ConfigurationManager).to.not.null();
        expect(ConfigurationManager).to.be.a('function');
        var instance = new ConfigurationManager();
        expect(instance).to.not.null();
        expect(instance).to.be.a('object');
        expect(instance).to.be.an.instanceOf(ConfigurationManager);
        expect(instance).to.have.property('environment').and.equal('development');
        expect(instance).to.have.property('configurations').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an.instanceOf(Configuration);
    });

    it('Manager open sync', function () {
        var instance = new ConfigurationManager();
        var filePath = configFilePath;
        expect(instance).to.respondTo('openSync');
        var fnError = instance.openSync.bind(instance, 'foo.json');
        expect(fnError).to.throw(Error);
        var fnOk = instance.openSync.bind(instance, filePath);
        expect(fnOk).to.not.throw(Error)
            .and.to.be.an('object')
            .and.to.be.an.instanceOf(Configuration);
    });

    it('Manager open async', function (done) {
        var instance = new ConfigurationManager();
        var filePath = configFilePath;
        expect(instance).to.respondTo('open');
        // Wrong case
        instance.open('foo.json', function (err, configuration) {
            expect(err).to.not.null();
            expect(err).to.be.instanceOf(Error);
            expect(configuration).to.be.empty();
            // Success case
            instance.open(filePath, function (err, configuration) {
                expect(err).to.be.null();
                expect(configuration).to.be.an('object')
                    .and.to.be.an.instanceOf(Configuration);
                done();
            });
        });
    });

    it('Manager _setupConfiguration', function () {
        var instance = new ConfigurationManager();
        expect(instance).to.respondTo('_setupConfigurations');
        var fn = instance._setupConfigurations.bind(instance, configMock);
        expect(fn).to.not.throw(Error);
        expect(instance).to.have.property('environment').and.equal('development');
        expect(instance).to.have.property('configurations').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an.instanceOf(Configuration);
        var current = instance.current;
        expect(current).to.have.property('foz').and.equal('baz');
        expect(current).to.have.property('foo').and.equal('bar');
    });

    it('Manager save sync', function () {
        var instance = new ConfigurationManager();
        var filePath = testFilePath;
        expect(instance).to.respondTo('saveSync');
        var fnOk = instance.saveSync.bind(instance, filePath);
        expect(fnOk).to.not.throw(Error);
    });

    it('Manager save async', function (done) {
        var instance = new ConfigurationManager();
        var filePath = testFilePath;
        expect(instance).to.respondTo('save');
        instance.save(filePath, function (err) {
            expect(err).to.be.null();
            done();
        });
    });

    it('Manager initialize', function () {
        expect(config).property('initialize').and.to.be.a('function');
        var fn = config.initialize.bind(config, testFilePath);
        expect(fn).to.not.throw(Error).and.to.be.an.instanceOf(ConfigurationManager);
    });

    it('Manager instance singleton', function () {
        var instance = config.instance;
        expect(instance).to.not.null();
        expect(instance).to.be.a('object');
        expect(instance).to.be.an.instanceOf(ConfigurationManager);
        expect(instance).to.have.property('environment').and.equal('development');
        expect(instance).to.have.property('configurations').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an.instanceOf(Configuration);
        expect(instance).to.have.property('current').to.include.keys('db');
    });

    it('Configuration environment inheritance', function () {
        var instance = config.instance;
        expect(instance).to.not.null();
        expect(instance).to.be.a('object');
        expect(instance).to.be.an.instanceOf(ConfigurationManager);
        expect(instance).to.have.property('environment').and.equal('development');
        expect(instance).to.have.property('configurations').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an('object');
        expect(instance).to.have.property('current').and.to.be.an.instanceOf(Configuration);
        expect(instance).to.have.property('current').to.include.keys('db', 'cookieSecret');
    });

    after('Cleanup', function (done) {
        var fs = require('fs');
        fs.access(testFilePath, fs.F_OK | fs.W_OK, function (err) {
            if (err) {
                return done(err);
            }
            fs.unlink(testFilePath, function (err) {
                if (err) {
                    return done(err);
                }
                done(null);
            });
        });
    });
});
