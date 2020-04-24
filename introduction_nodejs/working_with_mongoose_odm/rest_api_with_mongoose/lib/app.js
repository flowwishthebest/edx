const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('../configuration');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

mongoose.connect(
    `${config.mongodb.url}/${config.mongodb.dbName}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

if (!config.app.isProduction) {
    mongoose.set('debug', true);
}

require('./models/account.model');

app.use(require('./routes'));

app.use(require('./error-handler'));

module.exports = { app };
