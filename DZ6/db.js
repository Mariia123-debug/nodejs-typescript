import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'ich-edit.edu.itcareerhub.de',
  port: 3306,
  user: 'ich1',
  password: 'ich1_password_ilovedbs',
  database: 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;