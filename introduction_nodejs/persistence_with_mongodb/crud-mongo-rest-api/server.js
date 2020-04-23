const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const { MongoClient, ObjectID } = require('mongodb');
const { validate } = require('./middlewares/validate.middleware');
const { query, body, validationResult, checkSchema, param } = require('express-validator');
const config = require('./configuration');
const { EHttpStatus } = require('./utils');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

// TODO: unwrap server configuration from mongo connect
MongoClient.connect(config.mongodb.url, { useUnifiedTopology: true }, (e, c) => {

    if (e) {
        console.error(e);
        return process.exit(1);
    }

    const db = c.db(config.mongodb.dbName);
    const collection = db.collection(config.mongodb.collectionName);

    // TODO: limit, offset
    // TODO: validation
    // TODO: swagger
    app.get(
        '/api/accounts',
        [
            query('limit').isInt().toInt(),
            query('offset').isInt().toInt(),
        ],
        (req, res, next) => {
            // TODO: move to middleware
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                // TODO: throw custom validation error
                return next({
                    status: EHttpStatus.BadRequest,
                    code: 'ValidationException',
                    message: 'Invalid data passed',
                    domain: 'Accounts',
                    verbose: errors.errors,
                });
            }

            const { limit, offset } = req.params;

            // TODO: move to service / model
            collection
                .find({}, { limit, offset, sort: { _id: -1 } })
                .toArray((err, docs) => {
                    if (err) {
                        return next(err);
                    }

                    res.status(EHttpStatus.Ok).send({
                        apiVersion: 'v1',
                        domain: 'Accounts',
                        data: docs,
                    });
                });
        }
    );

    app.get(
        '/api/accounts/:id',
        [param('id').isString()],
        (req, res, next) => {

            // TODO: move to middleware
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // TODO: throw custom validation erro

                return next({
                    status: EHttpStatus.BadRequest,
                    code: 'ValidationException',
                    message: 'Invalid data passed',
                    domain: 'Accounts',
                    verbose: errors.errors,
                });
            }

            const id = ObjectID(req.params.id);

            collection.findOne({ _id: id }, (error, doc) => {
                if (error) {
                    return next(error);
                }
                
                res.status(EHttpStatus.Ok).send({
                    apiVersion: 'v1',
                    domain: 'Accounts',
                    data: doc,
                });
            });
        }
    );

    app.delete(
        '/api/accounts/:id',
        [param('id').isString()],
        (req, res, next) => {

            // TODO: move to middleware
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // TODO: throw custom validation erro

                return next({
                    status: EHttpStatus.BadRequest,
                    code: 'ValidationException',
                    message: 'Invalid data passed',
                    domain: 'Accounts',
                    verbose: errors.errors,
                });
            }

            const id = ObjectID(req.params.id);

            collection.remove({ _id: id }, (error, docs) => {
                if (error) {
                    return next(error);
                }
                
                res.status(EHttpStatus.NoContent).send();
            });
        }
    );
    
    app.put(
        '/api/accounts/:id',
        [
            param('id').isString(),
            body('balance').isInt().optional().toInt(),
            body('name').isString().optional(),
        ],
        (req, res, next) => {

            // TODO: move to middleware
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // TODO: throw custom validation erro

                return next({
                    status: EHttpStatus.BadRequest,
                    code: 'ValidationException',
                    message: 'Invalid data passed',
                    domain: 'Accounts',
                    verbose: errors.errors,
                });
            }

            const id = ObjectID(req.params.id);

            // TODO: check if exists or 404
            collection.update({ _id: id }, { $set: req.body }, (err, docs) => {
                if (error) {
                    return next(error);
                }

                res.send(results);
            });
        }
    );

    app.post(
        '/api/accounts',
        [
            body('balance').isInt(),
            body('name').isString(),
        ],
        (req, res, next) => {

            // TODO: move to middleware
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // TODO: throw custom validation error

                return next({
                    status: EHttpStatus.BadRequest,
                    code: 'ValidationException',
                    message: 'Invalid data passed',
                    domain: 'Accounts',
                    verbose: errors.errors,
                });
            }

            const newAccount = req.body;

            collection
                .insert(newAccount, (err, results) => {
                    if (error) {
                        return next(error);
                    }

                    res.status(EHttpStatus.Created).send(results);
                })
        });

        app.use((err, req, res, next) => {
            console.error(err);

            res
              .status(err.status || EHttpStatus.InternalServerError)
              .json({
                  apiVersion: 'v1',
                  domain: err.domain || 'Server',
                  error: {
                      status: err.status || EHttpStatus.InternalServerError,
                      code: err.code || 'InternalServerException',
                      msg: err.message,
                      errors: err.verbose,
                  }
              });
        });

        const server = app.listen(config.app.port, () => {
            console.log(`App started at: http://localhost:${config.app.port}`);
        });
});
