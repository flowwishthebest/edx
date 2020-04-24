module.exports = {
    id: {
        in: ['params'],
        isString: true,
    },
    name: {
        in: ['body'],
        isString: true,
    },
    balance: {
        in: ['body'],
        isInt: true,
        toInt: true,
    }
};
