import express from "express";
import bcrypt from "bcrypt";
import sequelize from "./config/db.js";
import User from "./models/User.js";

const app = express();

app.use(express.json());

// Регистрация
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email уже зарегистрирован",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        mustChangePassword: newUser.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({
      message: "Ошибка сервера при регистрации",
    });
  }
});

// Логин
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Неверный email или пароль",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Неверный email или пароль",
      });
    }

    if (user.mustChangePassword === true || user.mustChangePassword === 1) {
      return res.status(200).json({
        message: "Необходимо сменить пароль",
        mustChangePassword: true,
      });
    }

    res.status(200).json({
      message: "Вход выполнен успешно",
      mustChangePassword: false,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Ошибка логина:", error);
    res.status(500).json({
      message: "Ошибка сервера при логине",
    });
  }
});

// Смена пароля
app.post("/change-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email и новый пароль обязательны",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.mustChangePassword = false;

    await user.save();

    res.status(200).json({
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    console.error("Ошибка смены пароля:", error);
    res.status(500).json({
      message: "Ошибка сервера при смене пароля",
    });
  }
});

// Задача 3 — удаление аккаунта
app.post("/delete-account", async (req, res) => {
  try {
    const { email, currentPassword } = req.body;

    if (!email || !currentPassword) {
      return res.status(400).json({
        message: "Email и текущий пароль обязательны",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Неверный пароль",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "Аккаунт успешно удалён",
    });
  } catch (error) {
    console.error("Ошибка удаления аккаунта:", error);
    res.status(500).json({
      message: "Ошибка сервера при удалении аккаунта",
    });
  }
});

// Задача 4 — доступ для admin
app.get("/admin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email обязателен",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещён. Только для администратора",
      });
    }

    res.status(200).json({
      message: "Добро пожаловать, администратор",
    });
  } catch (error) {
    console.error("Ошибка доступа к admin:", error);
    res.status(500).json({
      message: "Ошибка сервера при доступе к admin",
    });
  }
});

// Задача 5 — изменение email
app.post("/change-email", async (req, res) => {
  try {
    const { email, newEmail, currentPassword } = req.body;

    if (!email || !newEmail || !currentPassword) {
      return res.status(400).json({
        message: "Email, новый email и текущий пароль обязательны",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Неверный пароль",
      });
    }

    const existingUser = await User.findOne({
      where: { email: newEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Новый email уже используется",
      });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({
      message: "Email успешно изменён",
      email: user.email,
    });
  } catch (error) {
    console.error("Ошибка смены email:", error);
    res.status(500).json({
      message: "Ошибка сервера при смене email",
    });
  }
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});