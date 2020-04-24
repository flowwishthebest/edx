const { Router } = require('express');

const router = Router();

router.use('/accounts', require('./accounts.route'));

module.exports = router;
