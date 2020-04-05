const { downloadWebPage } = require('./utils/download');
const { saveToFile } = require('./utils/save-to-file');

function crawl(url) {
    downloadWebPage(url, (err, data) => {
        if (err) {
            return console.log('Download web page failed with', err.message);
        }

        saveToFile(data, (err, details) => {
            if (err) {
                return console.error(
                    `Error while save to file: `, err.message,
                );
            }
            console.log(`Crawling ${url} finished. Saved to ${details.savedTo}`);
        });
    });
}

module.exports = { 
    crawl,
};
