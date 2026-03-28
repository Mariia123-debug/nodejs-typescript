const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.method === 'PUT') {
    res.statusCode = 200;
    res.end('PUT-запрос обработан');
    return;
  }

  if (req.method === 'DELETE') {
    res.statusCode = 200;
    res.end('DELETE-запрос обработан');
    return;
  }

  res.statusCode = 405;
  res.end('Method Not Allowed');
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});