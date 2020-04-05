const Https = require('https');

const URL = (
    'https://gist.githubusercontent.com/azat-co/' +
    'a3b93807d89fd5f98ba7829f0557e266/raw/' +
    '43adc16c256ec52264c2d0bc0251369faf02a3e2/gistfile1.txt'
);

Https.get(URL, (response) => {
    let chunksCount = 0;
    let rawData = '';

    response.on('data', (chunk) => {
        chunksCount++;
        rawData += chunk;
    });

    response.on('end', () => {
        console.log(`Response ended with ${chunksCount} chunk(s)`);

        try {
            const json = JSON.parse(rawData);
            console.log(json);
        } catch (err) {
            console.log(err.message);
        }
    });

    response.on('error', (err) => {
        console.error('Response error: ', err.message)
    });
})
.on('error', (err) => {
    console.error('Error while request: ', err.message);
});
