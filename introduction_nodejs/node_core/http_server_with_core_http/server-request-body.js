const Http = require('http');

const config = {
    server: {
        port: process.env.PORT || 3000,
    },
};

const EHttpStatus = {
    Ok: 200,
    Created: 201,
};

const EHttpMethod = {
    Post: 'POST',
};

const server = Http.createServer((request, response) => {
    const { method, url } = request;

    console.log(`Got new request on [${method}] ${url}`);

    switch (method) {
        case EHttpMethod.Post: {
            const rawData = [];
            let chunksCount = 0;

            request.on('data', (chunk) => {
                chunksCount++;
                rawData.push(chunk.toString());
            });

            request.on('end', () => {
                console.log(`Got body from request with ${chunksCount} chunk(s).`);
                console.log('Body: ', rawData.join(''));
                response.end('Body accepted.\n\n');
            });

            break;
        }
        default: {
            const responseBody = JSON.stringify({
                status: 'success',
                data: 'Hello, World!',
                errors: null,
                ts: Math.floor(Date.now() / 1000),
            });
        
            response.writeHead(EHttpStatus.Ok, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(responseBody),
            });
            response.write(responseBody);
        
            response.end();
        }
    }
});

server.listen(config.server.port, () => {
    console.log(
        `The server running on: http://localhost:${config.server.port}`,
    );
});
