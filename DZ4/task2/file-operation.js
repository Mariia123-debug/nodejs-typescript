const fs = require('fs');
require('dotenv').config();

// имя файла из .env
const fileName = process.env.FILENAME;

// текст для записи
const text = 'Привет! Это тестовый файл из Node.js';

// запись файла
fs.writeFileSync(fileName, text);

// чтение файла
const data = fs.readFileSync(fileName, 'utf-8');

// вывод
console.log('Содержимое файла:');
console.log(data);