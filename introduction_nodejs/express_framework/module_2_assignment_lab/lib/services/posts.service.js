const { db } = require('../../data/storage');

module.exports = {
    getPosts(limit, offset) {

    },
    getPostById(id, cb) {
        const post = db.posts.find((p) => p.id === id);
        
        if (!post) {
            return cb(new Error(`Posts with id (${id}) not found`));
        }

        cb(null, post);
    }
};
