const Fs = require('fs');
const Path = require('path');
const Guid = require('uuid/v1');

const dataDir = Path.join(process.cwd(), 'data');

function saveToFile(data, cb) {
    const dirName = Path.join(dataDir, Guid());

    Fs.mkdir(dirName, (err) => {
        if (err) {
            return cb({
                message: `Error on create dir ${dirName} is ${err.message}`,
            });
        }

        const filepath = Path.join(dirName, 'file.html');

        Fs.writeFile(filepath, data, (err) => {
            if (err) {
                return cb({
                    message: `Error on write file ${filepath} is ${err.message}`,
                });
            }

            cb(null, {
                savedTo: filepath,
                finishedAt: new Date(),
            });
        });
    });
}

module.exports = {
    saveToFile,
};
