const { EventEmitter } = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

emitter.once('knock', () => {
    console.log('Who is there?');
});

emitter.emit('knock');
emitter.emit('knock');
