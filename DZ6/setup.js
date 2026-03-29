import pool from './db.js';

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    console.log('Таблица products_test создана успешно');
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    process.exit();
  }
}

setup();