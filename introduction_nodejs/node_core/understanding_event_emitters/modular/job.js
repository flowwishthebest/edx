const { EventEmitter } = require('events');

class Job extends EventEmitter {
    constructor(ops) {
        super();
        this.on('start', () => {
            this._process(1000);
        });
    }

    _process(ms) {
        setTimeout(() => {
            // Emulate the delay of the job - async!
            this.emit('done', {
                completedOn: new Date(),
            })
        }, ms);
    }
}

module.exports = { Job };
