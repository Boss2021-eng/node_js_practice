// console.log('testing2 !');
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./middleware/logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}

// initialise objects
const myEmitter = new Emitter();

// add listener for the log events
// myEmitter.on('log', (msg) => logEvents(msg));

// setTimeout(() => {
//   // Emit Event
//   myEmitter.emit('log', 'Log Event Emitted');
// }, 2000);

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
