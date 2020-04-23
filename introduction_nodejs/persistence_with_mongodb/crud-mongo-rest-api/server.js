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

function validate(schema) {
    return (req, res, next) => {
        
    };
}

// TODO: unwrap server configuration from mongo connect
MongoClient.connect(config.mongodb.url, { useUnifiedTopology: true }, (err, client) => {
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection('accounts');

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
              console.log(errors);
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
              .stream({
                  transform: (x) => JSON.stringify(x),
              }).pipe(res);
        });

        app.post(
            '/api/accounts',
            [
              body('balance').isInt().toInt(),
              body('name').isString().toString(),
            ],
            (req, res) => {
                // TODO: move to middleware
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    // TODO: throw custom validation error
                    console.log(errors);
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

        app.put(
            '/api/accounts/:id',
            [
                param('id').isString().toString(),
                body('balance').isInt().toInt().optional(),
                body('name').isString().toString(),
            ],
            (req, res) => {

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
                })
        });

        app.delete(
            '/api/accounts/:id',
            (req, res) => {

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
                    
                    res.send(results);
                });
            });
        
        app.use(errorHandler());

        app.use((err, req, res, next) => {

            res
              .status(err.status || EHttpStatus.InternalServerError)
              .json({
                  apiVersion: 'v1',
                  domain: err.domain,
                  error: {
                      code: err.code,
                      msg: err.message,
                      errors: err.verbose,
                  }
              });
        });


        const server = app.listen(config.app.port, () => {
            console.log(`App started at: http://localhost:${config.app.port}`);
        });
});
