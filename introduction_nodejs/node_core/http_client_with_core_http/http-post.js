const Http = require('http');

const postData = JSON.stringify({ foo: 'bar' });

const options = {
    hostname: 'mockbin.com',
    port: 80,
    path: '/request?foo=bar&foo=baz',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
};

const req = Http.request(options, (response) => {
    let chunksCount = 0;

    response.on('data', (chunk) => {
        chunksCount++;
        console.log('body: ', chunk.toString());
    });

    response.on('end', () => {
        console.log(
            'No more data in response.',
            `Response ended with ${chunksCount} chunk(s)`,
        );
    });
});

req.on('error', (err) => {
    console.error('Error while request: ', err.message);
});

req.write(postData);
req.end();
