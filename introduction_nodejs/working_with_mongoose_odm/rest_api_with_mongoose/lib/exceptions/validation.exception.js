const  BadRequestException = require('./bad-request.exception');

class ValidationException extends BadRequestException {
    constructor(message, domain, verbose) {
        super(message, 'ValidationException', domain);

        this.verbose = verbose;
    }
}

module.exports = ValidationException;
