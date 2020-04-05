const fs = require('fs');
const path = require('path');
const { csvToJsonWithNpm } = require('../src/csv-to-json-with-npm');

describe('csv to json test', () => {
    test('Expected behaviour', () => {
        const csvFilepath = path.join(process.cwd(), '__tests__', 'test.csv');
        const jsonFilepath = path.join(process.cwd(), '__tests__', 'test.json');

        csvToJsonWithNpm(csvFilepath, jsonFilepath, () => {
            fs.readFile(jsonFilepath, (err, data) => {
                expect(err).toBeNull();

                let obj;
                try {
                    obj = JSON.parse(data);
                } catch (err) {
                    throw new Error('Failed. Invalid JSON');
                }

                expect(obj).toEqual([
                    {"id":"1","first_name":"Ario","last_name":"Noteyoung"},
                    {"id":"2","first_name":"Minni","last_name":"Endon"},
                    {"id":"3","first_name":"Bartie","last_name":"Burnard"},
                ]);
            });
        });
    });
});
