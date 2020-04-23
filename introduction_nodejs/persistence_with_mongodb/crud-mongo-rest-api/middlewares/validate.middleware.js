const { validationResult, checkSchema } = require('express-validator');

function validate(schema) {
    return (req, res, next) => {
        checkSchema(checkSchema).run(req);
        // await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // TODO: throw custom validation error
            console.log(errors);
            return next(new Error('validation'));
        }

        next();
    };
}

module.exports = { validate };
