const { checkSchema, validationResult } = require('express-validator');
const { ValidationException } = require('../exceptions');

const validate = (validations, domain) => {
    return (req, res, next) => {
        Promise.all(validations.map(validation => validation.run(req)))
            .then(() => {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return next(
                        new ValidationException(
                            'Invalid data passed',
                            domain,
                            errors.errors
                        )
                    );
                }

                next();
            });
    };
};

function validationMiddleware(schema, domain) {
    return validate(checkSchema(schema), domain);
}

module.exports = validationMiddleware;
