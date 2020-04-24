const { Router } = require('express');
const mongoose = require('mongoose');
const { validation } = require('../../middlewares');
const { EHttpStatus, EDomains } = require('../../utils');
const {
    NotFoundException,
} = require('../../exceptions');
const {
    getAccountsSchema,
    getAccountSchema,
    updateAccountSchema,
    createAccountSchema,
} = require('../../schemas');

const Account = mongoose.model('Account');

const router = Router();

router.get(
    '',
    validation(getAccountsSchema, EDomains.Accs),
    (req, res, next) => {
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
                    domain: EDomains.Accs,
                    data: docs,
                });
            });
});

router.get(
    '/:id',
    validation(getAccountSchema, EDomains.Accs),
    (req, res, next) => {
        const { id } = req.params;

        Account
            .findOne({ _id: id })
            .exec((error, account) => {
                if (error) {
                    // 500
                    return next(error);
                }

                if (!account) {
                    return next(
                        new NotFoundException(
                            'Can not find requested entity',
                            EDomains.Accs
                        )
                    );
                }
                
                res.status(EHttpStatus.Ok).send({
                    apiVersion: 'v1',
                    domain: EDomains.Accs,
                    data: account,
                });
        });
    }
);

router.delete(
    '/:id',
    validation(getAccountSchema, EDomains.Accs),
    (req, res, next) => {
        const { id } = req.params.id;

        Account
            .findOne({ _id: id })
            .exec((err, account) => {
                if (err) {
                    // 500
                    return next(err);
                }

                if (!account) {
                    return next(
                        new NotFoundException(
                            'Can not find requested entity',
                            EDomains.Accs
                        )
                    );
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
    validation(updateAccountSchema, EDomains.Accs),
    (req, res, next) => {
        const { id } = req.params;

        Account
            .findOne({ _id: id })
            .exec((err, account) => {
                if (err) {
                    // 500
                    return next(err);
                }

                if (!account) {
                    return next(
                        new NotFoundException(
                            'Can not find requested entity',
                            EDomains.Accs
                        )
                    );
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
                                domain: EDomains.Accs,
                                data: modified,
                            });
                        });
                    })
            });
    }
);

router.post(
    '',
    validation(createAccountSchema, EDomains.Accs),
    (req, res, next) => {
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
