var express = require('express');
var apiV1 = require('./config/routes');

var app = express();
app.use('/api/v1', apiV1);

app.listen(4000);
exports.app = app;
