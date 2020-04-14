const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { db } = require('../data/storage');
const { postsRouter } = require('./routes');
const { HttpStatus } = require('./helpers/http-status.helper');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());

app.use('/api/v1/posts', postsRouter);

app.get('/healthcheck', (req, res) => {
    res.sendStatus(HttpStatus.Ok);
});

app.get('/api/v1/posts/:id/comments', (req, res) => {
    let post = db.posts.find((p) => p.id == req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const comments = db.comments.filter((c) => c.postId == req.params.id);

    res.json({
        apiVersion: 'v1',
        domain: 'Comments',
        data: comments,
    });
});

app.post('/posts/:id/comments', (req, res) => {
    let post = db.posts.find((p) => p.id == req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const postId = req.params.id;
    const commentId = req.body.id;

    const existingComment = db.comments.find((c) => c.id == commentId);

    if (existingComment) {
        return res.sendStatus(HttpStatus.Forbidden);
    }

    db.posts.push(Object.assign({ postId }, req.body));

    res.sendStatus(HttpStatus.Created);
});


app.delete('/posts/:postId/comments/:commentId', (req, res) => {
    let post = db.posts.find((p) => p.id == req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const comment = db.comments.findIndex((c) => c.postId == req.params.postId && c.id == req.params.commentId)

    if (comment === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.comments.splice(comment, 1);

    res.sendStatus(HttpStatus.NoContent);
});

app.put('/posts/:postId/comments/:commentId', (req, res) => {
    let post = db.posts.find((p) => p.id == req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    const comment = db.comments.find((c) => c.postId == req.params.postId && c.id == req.params.commentId)

    if (comment === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    Object.assign(comment, req.body);

    res.sendStatus(HttpStatus.NoContent);
});

app.all('*', (req, res, next) => {
    next({
        statusCode: HttpStatus.NotFound,
        code: 'NotFoundException',
    });
});

app.use((err, req, res) => {
    console.log('Error hander works');

    res
        .status(HttpStatus.NotFound)
        .json({
            apiVersion: 'v1',
            error: err,
        })
});

module.exports = {
    server: app,
};
