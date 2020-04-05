const Http = require('http');

function downloadWebPage(targetUrl, cb) {
    console.log(`Download ${targetUrl} started...`);

    const request = Http.get(targetUrl, (response) => {
        const rawData = [];
        let chunksCount = 0;

        response.on('data', (chunk) => {
            chunksCount++;
            rawData.push(chunk.toString());
        });

        response.on('end', () => {
            console.log(
                `Downloading page ${targetUrl} ended`,
                `with ${chunksCount} chunk(s)`,
            );

            cb(null, rawData.join(''));
        });

        response.on('error', (err) => {
            console.error(
                `Error while handling reponse from ${targetUrl}`,
                `is ${err.message}`,
            );

            cb(err);
        });
    });

    request.on('error', (err) => {
        console.error(`Error while request to ${targetUrl} is ${err.message}`);
        cb(err);
    });
}

module.exports = {
    downloadWebPage,
};
