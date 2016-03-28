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
});
