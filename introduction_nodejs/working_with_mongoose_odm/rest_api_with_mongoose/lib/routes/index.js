const { Router } = require('express');

const router = Router();

router.use('/api/v1', require('./api'));

module.exports = router;
