const Http = require('http');

const URL = 'http://nodeprogram.com';

Http.get(URL, (response) => {
    let chunksCount = 0;

    response.on('data', (chunk) => {
        chunksCount++;
        console.log(chunk.toString());
    });

    response.on('end', () => {
        console.log(`Response ended with ${chunksCount} chunk(s)`);
    });
})
.on('error', (err) => {
    console.error('Error while request: ', err.message);
});
