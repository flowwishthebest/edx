const mongodb = require('mongodb');

// Connection URI
const url = 'mongodb://localhost:27017/edx-course-db';

// Use connect method to connect to the Server
mongodb.MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        console.log(err);
        return process.exit(1);
    }

    console.log('Kudos. Connected successfully to server');

    // Perform queries

    const cl = db.db('edx-course-db');

    insertDocuments(cl, (err, result) => {
        if (err) {
            db.close();
            return process.exit(1);
        }

        updateDocument(cl, (err, result) => {
            if (err) {
                db.close();
                return process.exit(1);
            }

            removeDocument(cl, (err, result) => {
                if (err) {
                    db.close();
                    return process.exit(1);
                }

                findDocuments(cl, (err, docs) => {
                    if (err) {
                        db.close();
                        return process.exit(1);
                    }

                    db.close();
                });
            });
        });
    });
});

function insertDocuments(db, callback) {
    // Get reference to edx-course-docs collection
    const collection = db.collection('edx-course-students');

    // Insert 3 documents
    collection.insert(
        [{ name : 'Bob' }, { name : 'John' }, { name : 'Peter' }],
        (error, result) => {
            if (error) {
                return callback(error);
            }

            console.log(result.result.n);
            console.log(result.ops.length);
            console.log(
                'Inserted 3 documents into the edx-course-students collection',
            );
            callback(null, result);
    });
}

function updateDocument(db, callback) {
    // Get the edx-course-students collection
    var collection = db.collection('edx-course-students');

    // Update document where a is 2, set b equal to 1
    const name = 'Peter';

    collection.update({ name }, { $set: { grade : 'A' } }, (err, result) => {
        if (err) {
            return callback(err);
        }

        console.log(result.result.n); // will be 1
        console.log(`Updated the student document where name = ${name}`);
        callback(null, result);
    });
}

function removeDocument(db, callback) {
    // Get the documents collection
    const collection = db.collection('edx-course-students');

    // Insert some documents
    const name = 'Bob';

    collection.remove({ name }, (err, result) => {
        if (err) {
            return callback(err);
        }

        console.log(result.result.n); // will be 1
        console.log(`Removed the document where name = ${name}`);
        callback(null, result);
    });
}

function findDocuments(db, callback) {
    // Get the documents collection
    var collection = db.collection('edx-course-students');

    // Find some documents
    collection.find({}).toArray((err, docs) => {
        if (err) {
            return callback(err);
        }
        
        console.log(2, docs.length); // will be 2 because we removed one document
        console.log(`Found the following documents:`);
        console.dir(docs);
        callback(null, docs);
    });
}
