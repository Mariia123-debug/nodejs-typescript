const fs = require('fs');

// Создание папки
fs.mkdir('myFolder', (err) => {
  if (err) {
    console.log('Ошибка при создании папки:', err);
    return;
  }

  console.log('Папка успешно создана');

  // Удаление папки
  fs.rmdir('myFolder', (err) => {
    if (err) {
      console.log('Ошибка при удалении папки:', err);
      return;
    }

    console.log('Папка успешно удалена');
  });
});