const { crawl } = require('./src/crawl');

const url = process.argv.slice(2);

if (!url.length) {
    console.log('[Web crawler] Usage node index.js <url>');
    process.exit(1);
}

crawl(url[0]);
