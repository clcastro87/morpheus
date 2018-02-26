var expect = require('chai').expect;
var helpers = require('../../src/helpers');

describe('Helper methods', function () {

    it('Capitalize letter', function () {
        expect(helpers).to.not.null();
        expect(helpers).to.be.an('object');
        expect(helpers).to.respondTo('capitalize');
        expect(helpers.capitalize('')).to.be.eql('');
        expect(helpers.capitalize('c')).to.be.eql('C');
        expect(helpers.capitalize('console')).to.be.eql('Console');
        expect(helpers.capitalize('twoWords')).to.be.eql('TwoWords');
    });

    it('Camelize text', function () {
        expect(helpers).to.not.null();
        expect(helpers).to.be.an('object');
        expect(helpers).to.respondTo('toCamelCase');
        expect(helpers.toCamelCase('')).to.be.eql('');
        expect(helpers.toCamelCase('c')).to.be.eql('c');
        expect(helpers.toCamelCase('console_new')).to.be.eql('consoleNew');
        expect(helpers.toCamelCase('two Words')).to.be.eql('twoWords');
    });

    it('Kebab text', function () {
        expect(helpers).to.not.null();
        expect(helpers).to.be.an('object');
        expect(helpers).to.respondTo('toKebabCase');
        expect(helpers.toKebabCase('')).to.be.eql('');
        expect(helpers.toKebabCase('c')).to.be.eql('c');
        expect(helpers.toKebabCase('console_new')).to.be.eql('console-new');
        expect(helpers.toKebabCase('two Words')).to.be.eql('two-words');
    });

    it('Snake text', function () {
        expect(helpers).to.not.null();
        expect(helpers).to.be.an('object');
        expect(helpers).to.respondTo('toSnakeCase');
        expect(helpers.toSnakeCase('')).to.be.eql('');
        expect(helpers.toSnakeCase('c')).to.be.eql('c');
        expect(helpers.toSnakeCase('console-new')).to.be.eql('console_new');
        expect(helpers.toSnakeCase('two Words')).to.be.eql('two_words');
    });
});
