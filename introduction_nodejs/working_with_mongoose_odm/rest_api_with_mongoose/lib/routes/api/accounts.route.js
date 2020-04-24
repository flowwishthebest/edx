const { Router } = require('express');
const mongoose = require('mongoose');
// const { validation } = require('../../middlewares');
const { query, body, validationResult, param } = require('express-validator');
const { EHttpStatus } = require('../../utils');

const Account = mongoose.model('Account');

const router = Router();

router.get(
    '',
    [
        query('limit').isInt().toInt(),
        query('offset').isInt().toInt(),
    ],
    (req, res, next) => {
        // // TODO: move to middleware
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

        const { limit, offset } = req.query;

        Account
            .find()
            .limit(limit)
            .skip(offset)
            .sort({ _id: -1 })
            .exec((err, docs) => {
                if (err) {
                    // 500
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

router.get(
    '/:id',
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

        const { id } = req.params;

        Account
            .findOne({ _id: id })
            .exec((error, account) => {
                if (error) {
                    // 500
                    return next(error);
                }

                if (!account) {
                    return next({
                        status: EHttpStatus.NotFound,
                        code: 'NotFoundException',
                        message: 'Can not find requested entity',
                        domain: 'Accounts',
                        verbose: errors.errors,
                    });
                }
                
                res.status(EHttpStatus.Ok).send({
                    apiVersion: 'v1',
                    domain: 'Accounts',
                    data: account,
                });
        });
    }
);

router.delete(
    '/:id',
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
            });
        }

        const { id } = req.params.id;

        Account
            .findOne({ _id: id })
            .exec((err, account) => {
                if (err) {
                    // 500
                    return next(err);
                }

                if (!account) {
                    return next({
                        status: EHttpStatus.NotFound,
                        code: 'NotFoundException',
                        message: 'Can not find requested entity',
                        domain: 'Accounts',
                    });
                }

                Account
                    .remove({ _id: id })
                    .exec((err) => {
                        if (err) {
                            // 500
                            return next(err);
                        }

                        res.status(EHttpStatus.NoContent).send();
                    });
            });
    }
);

router.put(
    '/:id',
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

        const { id } = req.params;

        Account
            .findOne({ _id: id })
            .exec((err, account) => {
                if (err) {
                    // 500
                    return next(err);
                }

                if (!account) {
                    return next({
                        status: EHttpStatus.NotFound,
                        code: 'NotFoundException',
                        message: 'Can not find requested entity',
                        domain: 'Accounts',
                    });
                }

                const updateData = {};

                if (req.body.balance) {
                    updateData.balance = req.body.balance;
                }

                if (req.body.name) {
                    updateData.name = req.body.name;
                }

                Account
                    .updateOne({ _id: id }, updateData, (err) => {
                        if (err) {
                            // 500
                            return next(err);
                        }

                        Account.findOne({ _id: id }, (err, modified) => {
                            if (err) {
                                // 500
                                return next(err);
                            }

                            res.status(EHttpStatus.Ok).send({
                                apiVersion: 'v1',
                                domain: 'Accounts',
                                data: modified,
                            });
                        });
                    })
            });
    }
);

router.post(
    '',
    [
        body('balance').isInt().toInt(),
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

        Account.create(newAccount, (err, account) => {
            if (err) {
                // 500
                return next(err);
            }

            res.status(EHttpStatus.Created).send(account);
        });
    }
);

module.exports = router;
