const path = require('path');
const { csvToJsonWithNpm } = require('./src/csv-to-json-with-npm');

function main() {
    let [csvFilepath, jsonFilepath] = process.argv.slice(2);

    if (!csvFilepath) {
        csvFilepath = path.join(process.cwd(), 'data', 'customer-data.csv');
    }

    if (!jsonFilepath) {
        csvFilepath = path.join(process.cwd(), 'data', 'customer-data.json');
    }

    csvToJsonWithNpm(csvFilepath, jsonFilepath);
}

main();