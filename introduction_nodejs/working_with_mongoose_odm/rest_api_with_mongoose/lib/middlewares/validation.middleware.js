function validationMiddleware(schema) {
    return (req, res, next) => {
        console.log('Validation middleware');
        next();
    };
}

module.exports = validationMiddleware;
