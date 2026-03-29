import express from 'express';
import sequelize from './config/db.js';
import Book from './models/book.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Проверка подключения к БД
sequelize
  .authenticate()
  .then(() => console.log('Подключение к БД успешно'))
  .catch((error) => console.error('Ошибка подключения к БД:', error));

// GET /books - получить все книги
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /books - создать книгу
app.post('/books', async (req, res) => {
  try {
    const { title, author, year } = req.body;

    const newBook = await Book.create({ title, author, year });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /books/:id - обновить книгу
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;

    const [updatedRows] = await Book.update(
      { title, author, year },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const updatedBook = await Book.findByPk(id);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /books/:id - удалить книгу
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Book.destroy({
      where: { id }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    res.json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});