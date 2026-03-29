import express from 'express';
import pool from './db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  try {
    res.send('Hello, World!');
  } catch (error) {
    res.status(500).json({ error: 'Ошибка на сервере' });
  }
});

app.post('/', (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Данные не были отправлены' });
    }

    res.json({
      message: 'POST запрос получен успешно',
      receivedData: data
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обработке POST запроса' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        error: 'Нужно отправить name и price'
      });
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        error: 'price должно быть числом'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      [name, numericPrice]
    );

    res.status(201).json({
      message: 'Продукт успешно добавлен',
      productId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении продукта' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});