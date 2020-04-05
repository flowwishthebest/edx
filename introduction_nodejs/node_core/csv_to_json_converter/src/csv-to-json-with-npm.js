const Fs = require('fs');
const Stream = require('stream');
const CsvToJson = require('csvtojson/v1');

function csvToJsonWithNpm(csvFilepath, jsonFilepath, cb) {
    const read = Fs.createReadStream(csvFilepath);
    const write = Fs.createWriteStream(jsonFilepath);

    const converter = CsvToJson({
        toArrayString: true,
    });

    Stream.pipeline(
        read,
        converter,
        write,
        (err) => {
            if (err) {
                console.error(
                    'Error while csv to json handling is ', err.message,
                );

                return process.exit(1);
            }

            cb();
        });
}

module.exports = {
    csvToJsonWithNpm,
};
