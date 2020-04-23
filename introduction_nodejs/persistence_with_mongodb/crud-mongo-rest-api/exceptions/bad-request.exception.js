const { HttpException } = require('./http.exception');
const { EHttpStatus } = require('../utils');

class BadRequestException extends HttpException {
    constructor(message) {}
}
