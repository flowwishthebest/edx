const fs = require('fs');
const csvToJson = require('csvtojson/v1');

function csvToJsonWithNpm(csvFilepath, jsonFilepath) {
    const read = fs.createReadStream(csvFilepath);
    const write = fs.createWriteStream(jsonFilepath);

    const converter = csvToJson({
        toArrayString: true,
    });

    read.pipe(converter).pipe(write);
}

module.exports = {
    csvToJsonWithNpm,
};
