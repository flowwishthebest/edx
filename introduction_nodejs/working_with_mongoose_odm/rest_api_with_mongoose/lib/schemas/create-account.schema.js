module.exports = {
    name: {
        in: ['body'],
        isString: true,
    },
    balance: {
        in: ['body'],
        isInt: true,
        toInt: true,
    },
};
