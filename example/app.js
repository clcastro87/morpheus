var express = require('express');
var logger = require('morgan');
// Local modules
var apiV1 = require('./config/routes');
// App definition
var app = express();
// Using morgan
app.use(logger('dev'));
// Registering restier app.
app.use('/api/v1', apiV1);
// Listen on 4000
app.listen(4000);
// Export app for compatibility
exports.app = app;
