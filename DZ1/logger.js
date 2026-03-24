const fs = require('fs');

function logMessage(message) {
  const log = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile('log.txt', log, (err) => {
    if (err) {
      console.error('Ошибка записи:', err);
    }
  });
}

module.exports = logMessage