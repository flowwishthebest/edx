const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('../data/storage');

const HttpStatus = {
    Ok: 200,
    Created: 201,
    Forbidden: 403,
    NotFound: 404,
    NoContent: 204,
};

const app = express();

app.use(bodyParser());

app.get('/', (req, res) => {
    res.status(HttpStatus.Ok);
    res.json({
        message: 'Hello, World!'
    });
});

app.get('/healthcheck', (req, res) => {
    res.sendStatus(HttpStatus.Ok);
});

app.get('/api/v1/posts', (req, res) => {
    res.json({
        apiVersion: 'v1',
        domain: 'Posts',
        data: db.posts
    });
});

app.get('/api/v1/posts/:id', (req, res) => {
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

app.post('/posts', (req, res) => {
    const postId = req.body.id;

    const existingPost = db.posts.find((p) => p.id == postId);

    if (existingPost) {
        return res.sendStatus(HttpStatus.Forbidden);
    }

    db.posts.push(req.body);

    res.sendStatus(HttpStatus.Created);
});

app.put('/posts/:id', (req, res) => {
    let post = db.posts.find((p) => p.id === req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    post = Object.assign(post, req.body);

    res.sendStatus(HttpStatus.NoContent);
});

app.delete('/posts/:id', (req, res) => {
    let post = db.posts.findIndex((p) => p.id == req.params.id);

    if (post === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.posts.splice(post, 1);

    res.sendStatus(HttpStatus.NoContent);
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

module.exports = {
    server: app,
};
