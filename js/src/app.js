const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { passport } = require('./handlers/authentication');
const { exceptionParser, errorCodeParser } = require('./handlers/error');

// Export app
module.exports = {
    app
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Require controllers
require('./controller/controller')

// Error handlers
app.use(exceptionParser)
app.use(errorCodeParser)