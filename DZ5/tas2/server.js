const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  try {
    // специально вызываем ошибку
    throw new Error('Test server error');
  } catch (error) {
    const logMessage = `[${new Date().toISOString()}] ${error.message}\n`;

    fs.appendFile('errors.log', logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err.message);
      }
    });

    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});