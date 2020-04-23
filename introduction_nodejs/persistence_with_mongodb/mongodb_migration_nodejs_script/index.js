const { MongoClient } = require('mongodb');
const async = require('async');
const customers = require('./data/m3-customer-data.json');
const address = require('./data/m3-customer-address-data.json');

const url = 'mongodb://localhost:27017';
const dbName = 'edx-nodejs-course';
const collectionName = 'customers';

const chunk = process.argv[2] ? parseInt(process.argv[2], 10) : customers.length;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const tasks = [];

    for (let i = 0; i < customers.length; i += chunk) {
        const start = i;
        const end = i + chunk;

        const chunkedCustomers = customers
            .slice(start, end)
            .map((customer, idx) => Object.assign(customer, address[idx]));

        const task = (callback) => {
            console.log(`Processing ${chunkedCustomers.length} customer(s).`);

            collection.insertMany(chunkedCustomers, (err, docs) => {
                callback(err, docs);
            });
        };

        tasks.push(task);
    }

    console.log(`Starting migration... Got ${tasks.length} task(s).`);
    async.parallel(tasks, (err, results) => {
        if (err) {
            console.error(err);
            return process.exit(1);
        }

        console.log('Migration finished. Closing connect to mongo...');

        client.close();
    });
});
