// TODO: secrets to env
module.exports = {
    app: {
        port: 3001,
        isProduction: process.env.NODE_ENV === 'production',
    },
    mongodb: {
        url: 'mongodb://localhost:27017',
        dbName: 'edx-course-db',
        collectionName: 'accounts',
    },
};
