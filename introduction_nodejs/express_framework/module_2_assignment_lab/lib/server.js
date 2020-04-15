const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { HttpStatus } = require('./helpers/http-status.helper');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(require('./routes'));

app.use((err, req, res) => {
    res
        .status(err.status || HttpStatus.InternalServerError)
        .json({
            apiVersion: 'v1',
            error: err,
        })
});

module.exports = {
    server: app,
};
