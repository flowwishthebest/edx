const HttpException = require('./http.exception');
const { EHttpStatus } = require('../utils');

class BadRequestException extends HttpException {
    constructor(message, code, domain) {
        super(message, EHttpStatus.BadRequest, code, domain);
    }
}

module.exports = BadRequestException;
