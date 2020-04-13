const express = require('express');

const HttpStatus = {
    Ok: 200,
};

const app = express();

app.get('/', (req, res) => {
    res.status(HttpStatus.Ok);
    res.json({
        message: 'Hello, World!'
    });
});

module.exports = {
    server: app,
};
