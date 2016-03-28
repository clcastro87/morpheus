/**
 * Copyright 2016
 * Created by Carlos on 3/28/2016.
 */

var expect = require('chai').expect;
var logger = require('../../src/lib/logger');
var winston = require('winston');

describe('Logger Handler', function () {

    it('Build configuration', function () {
        expect(logger).to.not.null();
        expect(logger).to.be.a('function');
        expect(logger).to.have.property('_buildConfiguration').and.to.be.a('function');
        var defaultConfig = {
            foo: 'bar',
            transports: {
                console: {
                    colorize: true,
                    level: 'debug'
                }
            }
        };
        var fn = logger._buildConfiguration.bind({}, 'test', defaultConfig);
        expect(fn).to.not.throw(Error);
        var result = fn();
        expect(result).to.be.an('object');
        expect(result).to.have.property('foo').and.equal('bar');
        expect(result).to.have.property('transports').and.to.be.an('array');
    });

    it('Get configuration', function () {
        expect(logger).to.not.null();
        expect(logger).to.be.a('function');
        expect(logger).to.have.property('_getConfiguration').and.to.be.a('function');
        var fn = logger._getConfiguration.bind({}, 'test');
        expect(fn).to.not.throw(Error);
    });

    it('Get Logger', function () {
        expect(logger).to.not.null();
        expect(logger).to.be.a('function');
        var fn = logger.bind(logger, 'test');
        expect(fn).to.not.throw(Error);
        var result = fn();
        expect(result).to.be.an('object').and.to.be.an.instanceOf(winston.Logger);
        expect(result).to.respondTo('log');
        expect(result).to.respondTo('error');
        expect(result).to.respondTo('warn');
        expect(result).to.respondTo('info');
        expect(result).to.respondTo('debug');
        var fnLog = result.debug.bind(result, 'Hello world!');
        expect(fnLog).to.not.throw(Error);
    });
});
