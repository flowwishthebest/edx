const { EventEmitter } = require('events');

class Job extends EventEmitter {}

const job = new Job();

job.on('done', (timeDone) => {
    console.log('Job was pronounced done at', timeDone);
});

job.emit('done', new Date());
job.removeAllListeners(); // remove all observers
