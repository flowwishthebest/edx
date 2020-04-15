const router = require('express').Router();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { HttpStatus } = require('../helpers/http-status.helper');

router.use('/api', require('./api'));

router.get('/healthcheck', (req, res) => {
    res.sendStatus(HttpStatus.Ok);
});

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Blog API',
        description: 'Blog API Information',
        contact: {
          name: 'Ilya P',
        },
        servers: ['http://localhost:3000'],
      }
    },
    // ['.routes/*.js']
    apis: ['./v1/**/*.js']
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/docs/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


router.all('*', (req, res, next) => {
    // catch 404 and forward to error handler
    next({
        status: HttpStatus.NotFound,
        code: 'NotFoundException',
    });
});


module.exports = router;
