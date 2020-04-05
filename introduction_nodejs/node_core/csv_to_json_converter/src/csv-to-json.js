const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('./data/customer-data.xls'),
});

const writeStream = fs.createWriteStream('./data/customer-data.json');

let expectingHeading = true;

writeStream.write('[');

let props = null;
rl.on('line', (chunk) => {
    if (expectingHeading) {
        props = chunk.split(',');
        expectingHeading = false;
    } else {
        writeStream.write('{');
        const json = {};

        chunk.split(',').forEach((v, i) => {
            writeStream.write(`"${props[i]}":"${v}"`);

            if (i < props.length - 1) {
                writeStream.write(',');
            }
        });

        writeStream.write('}');
    }
});

rl.on('close', () => {
    writeStream.end(']');
});
