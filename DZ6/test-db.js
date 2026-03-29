import pool from './db.js';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Подключение успешно');
    connection.release();
  } catch (error) {
    console.error('Ошибка подключения:', error.message);
  }
}

testConnection();