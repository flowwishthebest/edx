const { app } = require('./lib/app');
const config = require('./configuration');

const server = app.listen(config.app.port, () => {
    console.log(`App started at: http://localhost:${config.app.port}`);
});
