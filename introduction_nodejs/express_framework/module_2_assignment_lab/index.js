const { server } = require('./lib/server')

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`The server running on http://localhost:${PORT}`);
});
