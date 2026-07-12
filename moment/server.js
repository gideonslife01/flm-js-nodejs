const http = require('http');
const moment = require('moment');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('CommonJS:Hello World!\n');
  });

// moment package 
// usage : https://momentjs.com/
const mtime = moment().format('MMMM Do YYYY, h:mm:ss a');
const mtimes = moment().format('LT');
console.log(mtime);
console.log(mtimes);


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`CommonJS:Server is running on port ${PORT}`);
});
