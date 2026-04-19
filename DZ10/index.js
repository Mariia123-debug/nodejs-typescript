const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 3000;
const SECRET_KEY = "super_secret_key";

// Симуляция базы данных
let users = [
  {
    id: 1,
    username: "admin",
    email: "admin@mail.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: 2,
    username: "user1",
    email: "user1@mail.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

// -------------------- MIDDLEWARE --------------------

// Проверка JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Токен отсутствует" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Неверный формат токена" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Токен недействителен или просрочен" });
  }
}

// Проверка роли
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Доступ запрещён" });
    }
    next();
  };
}

// -------------------- ROUTES --------------------

// Главная
app.get("/", (req, res) => {
  res.send("Сервер работает");
});

// Логин
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Успешный вход",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// ---------------------------------------------------
// ЗАДАНИЕ 1: обновление email
// ---------------------------------------------------
app.put("/update-email", authenticateJWT, (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "Новый email обязателен" });
    }

    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.email = newEmail;

    res.json({
      message: "Email успешно обновлён",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении email", error: error.message });
  }
});

// ---------------------------------------------------
// ЗАДАНИЕ 2: удаление аккаунта
// ---------------------------------------------------
app.delete("/delete-account", authenticateJWT, (req, res) => {
  try {
    const userExists = users.find((u) => u.id === req.user.id);

    if (!userExists) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    users = users.filter((u) => u.id !== req.user.id);

    res.json({
      message: "Аккаунт успешно удалён",
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении аккаунта", error: error.message });
  }
});

// ---------------------------------------------------
// ЗАДАНИЕ 3: обновление роли пользователя
// Только для admin
// ---------------------------------------------------
app.put("/update-role", authenticateJWT, authorizeRole("admin"), (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ message: "userId и newRole обязательны" });
    }

    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.role = newRole;

    res.json({
      message: "Роль успешно обновлена",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении роли", error: error.message });
  }
});

// ---------------------------------------------------
// ЗАДАНИЕ 4: refresh JWT токена
// ---------------------------------------------------
app.post("/refresh-token", authenticateJWT, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const newToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Токен успешно обновлён",
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении токена", error: error.message });
  }
});

// Показать пользователей для проверки
app.get("/users", (req, res) => {
  const safeUsers = users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
  }));

  res.json(safeUsers);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});