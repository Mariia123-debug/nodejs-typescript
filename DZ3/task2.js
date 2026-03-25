const fs = require('fs');

// Запись в файл
fs.writeFile('info.txt', 'Node.js is awesome!', (err) => {
  if (err) {
    console.log('Ошибка при записи файла:', err);
    return;
  }

  console.log('Файл успешно записан');

  // Чтение файла
  fs.readFile('info.txt', 'utf8', (err, data) => {
    if (err) {
      console.log('Ошибка при чтении файла:', err);
      return;
    }

    console.log('Содержимое файла:', data);
  });
});