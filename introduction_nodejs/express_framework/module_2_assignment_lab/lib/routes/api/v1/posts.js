const router = require('express').Router();
const { param, validationResult } = require('express-validator');
const { db } = require('../../../../data/storage');
const { HttpStatus } = require('../../../helpers/http-status.helper');
const PostsService = require('../../../services/posts.service');

// TODO: validation
// TODO: limit, offset params
/**
 * @swagger
 * /posts:
 *  get:
 *    description: Get all posts
 *    responses:
 *      '200':
 *        description: Lists of posts
 */
router.get('', (req, res) => {
    res.json({
        apiVersion: 'v1',
        domain: 'Posts',
        data: db.posts
    });
});

// TODO: validation
router.get('/:id', [param('id').isInt().toInt()], (req, res) => {
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

    PostsService.getPostById(req.params.id, (err, post) => {
        if (err) {
            return res
                .status(HttpStatus.NotFound)
                .json({
                    apiVersion: 'v1',
                    domain: 'Posts',
                    error: {
                        code: err.code || 'InternalException',
                        message: err.message,
                        status: HttpStatus.NotFound,
                    } 
                });
        }

        res.json({
            apiVersion: 'v1',
            domain: 'Posts',
            data: post
        });
    });
});

// TODO: validation
router.post('', (req, res) => {
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
router.put('/:id', (req, res) => {
    let post = db.posts.find((p) => p.id === req.params.id);

    if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    post = Object.assign(post, req.body);

    res.sendStatus(HttpStatus.NoContent);
});

// TODO: validation
router.delete('/:id', (req, res) => {
    let post = db.posts.findIndex((p) => p.id == req.params.id);

    if (post === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.posts.splice(post, 1);

    res.sendStatus(HttpStatus.NoContent);
});

router.get('/:id/comments', (req, res) => {
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

router.post('/:id/comments', (req, res) => {
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


router.delete('/:postId/comments/:commentId', (req, res) => {
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

router.put('/:postId/comments/:commentId', (req, res) => {
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

module.exports = router;
