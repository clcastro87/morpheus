/**
 * Cache middleware.
 *
 * @author: Carlos Luis Castro Márquez
 * @date: 12/18/2015
 */
(function (cache) {
    'use strict';

    // Module requires
    var ms = require('ms');

    // Module exports
    cache.disabled = noCache;
    cache.private = privateCache;
    cache.public = publicCache;
    cache.default = apiCache;

    // Private fields
    var defaultTTL = 24 * 3600; // 1d

    function noCache() {
        return function (req, res, next) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            next();
        };
    }

    function privateCache(ttl) {
        return function (req, res, next) {
            var theTTL = parseTTL(ttl);
            res.setHeader('Cache-Control', 'private, ' + theTTL);
            res.removeHeader('Pragma');
            next();
        };
    }

    function publicCache(ttl) {
        return function (req, res, next) {
            var theTTL = parseTTL(ttl);
            res.setHeader('Cache-Control', 'public, ' + theTTL);
            res.removeHeader('Pragma');
            next();
        };
    }

    function apiCache(ttl) {
        return function (req, res, next) {
            var theTTL = parseTTL(ttl);
            res.setHeader('Cache-Control', 'private, no-store, ' + theTTL);
            res.removeHeader('Pragma');
            next();
        };
    }

    function parseTTL(ttl) {
        return isNaN(ttl) ? ms(ttl) / 1000 : (ttl || defaultTTL);
    }

})(module.exports);
