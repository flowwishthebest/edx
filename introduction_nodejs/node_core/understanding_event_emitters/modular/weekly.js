const { Job } = require('./job');

const job = new Job();

job.on('done', (details) => {
    console.log(
        'Weekly email job was completed at', details.completedOn,
    );
});

job.emit('start');
