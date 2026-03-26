const moment = require('moment');

// текущая дата и время
const now = moment();

// форматы
const format1 = now.format('DD-MM-YYYY');
const format2 = now.format('MMM Do YY');
const format3 = now.format('dddd');

// вывод
console.log('DD-MM-YYYY:', format1);
console.log('MMM Do YY:', format2);
console.log('dddd:', format3);