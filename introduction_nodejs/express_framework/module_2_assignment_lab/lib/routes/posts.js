const express = require('express');
const { param, validationResult } = require('express-validator');
const { db } = require('../../data/storage');
const { HttpStatus } = require('../helpers/http-status.helper');

const postsRouter = express.Router();

postsRouter.get('', (req, res) => {
    res.json({
        apiVersion: 'v1',
        domain: 'Posts',
        data: db.posts
    });
});

postsRouter.get('/:id', [param('id').isInt().toInt()], (req, res) => {
    // TODO: move to validation middleware
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // TODO: move to error hander. Throw validation error
        return res
            .status(HttpStatus.BadRequest)
            .json({
                apiVersion: 'v1',
                domain: 'Posts',
                error: {
                    code: 'Validation',
                    errors: errors.array(),
                }
            });
        }

    const post = db.posts.find((p) => p.id == req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    res.json({
        apiVersion: 'v1',
        domain: 'Posts',
        data: post
    });
});

// TODO: validation
postsRouter.post('', (req, res) => {
    // TODO: move logic to service
    const postId = req.body.id;

    const existingPost = db.posts.find((p) => p.id == postId);

    if (existingPost) {
        return res.sendStatus(HttpStatus.Forbidden);
    }

    db.posts.push(req.body);

    res.sendStatus(HttpStatus.Created);
});

// TODO: validation
postsRouter.put('/:id', (req, res) => {
    let post = db.posts.find((p) => p.id === req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    post = Object.assign(post, req.body);

    res.sendStatus(HttpStatus.NoContent);
});

// TODO: validation
postsRouter.delete('/:id', (req, res) => {
    let post = db.posts.findIndex((p) => p.id == req.params.id);

    if (post === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.posts.splice(post, 1);

    res.sendStatus(HttpStatus.NoContent);
});

module.exports = { postsRouter };
