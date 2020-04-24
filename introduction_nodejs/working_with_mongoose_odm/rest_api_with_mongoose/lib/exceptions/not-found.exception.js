const HttpException = require('./http.exception');
const { EHttpStatus } = require('../utils');

class NotFoundException extends HttpException {
    constructor(message, domain) {
        super(message, EHttpStatus.NotFound, 'NotFoundException', domain);
    }
}

module.exports = NotFoundException;
