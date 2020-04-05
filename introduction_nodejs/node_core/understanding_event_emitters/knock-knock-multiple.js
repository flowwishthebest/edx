const { EventEmitter } = require('events');

class Emitter extends EventEmitter {}

const emitter = new Emitter();

emitter.on('knock', () => {
    console.log('Who is there?');
});

emitter.on('knock', () => {
    console.log('Go away!');
});

emitter.emit('knock');
emitter.emit('knock');
