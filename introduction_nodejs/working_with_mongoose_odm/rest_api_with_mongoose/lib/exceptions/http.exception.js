const { EHttpStatus } = require('../utils');

class HttpException extends Error {
    constructor(message, status, code, domain) {
        super(message);

        this.status = status || EHttpStatus.InternalServerError;
        this.domain = domain || 'Server';
        this.code = code || 'InternalServerException';
    }
}

module.exports = HttpException;
