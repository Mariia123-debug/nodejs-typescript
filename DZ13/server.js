import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Publisher from "./models/Publisher.js";
import Magazine from "./models/Magazine.js";
import Tag from "./models/Tag.js";
import Article from "./models/Article.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Подключение к MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Успешное подключение к MongoDB");
  })
  .catch((error) => {
    console.error("Ошибка подключения к MongoDB:", error.message);
  });

// Дополнительные события подключения
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Тестовый роут
app.get("/", (req, res) => {
  res.send("Server is running");
});

/*
  ТЕСТОВЫЙ РОУТ:
  Создает данные для проверки связей:
  - one-to-many: Publisher -> Magazine
  - many-to-many: Tag <-> Article
*/
app.get("/seed", async (req, res) => {
  try {
    await Publisher.deleteMany({});
    await Magazine.deleteMany({});
    await Tag.deleteMany({});
    await Article.deleteMany({});

    // ---------- One-to-Many ----------
    const publisher = await Publisher.create({
      name: "National Publisher",
      location: "Vienna",
    });

    const magazine1 = await Magazine.create({
      title: "Tech Monthly",
      issueNumber: 1,
      publisher: publisher._id,
    });

    const magazine2 = await Magazine.create({
      title: "Science Weekly",
      issueNumber: 25,
      publisher: publisher._id,
    });

    // ---------- Many-to-Many ----------
    const article1 = await Article.create({
      title: "Node.js Basics",
      content: "Introduction to Node.js",
    });

    const article2 = await Article.create({
      title: "MongoDB Guide",
      content: "Working with MongoDB and Mongoose",
    });

    const tag1 = await Tag.create({
      name: "backend",
      articles: [article1._id, article2._id],
    });

    const tag2 = await Tag.create({
      name: "database",
      articles: [article2._id],
    });

    article1.tags = [tag1._id];
    article2.tags = [tag1._id, tag2._id];

    await article1.save();
    await article2.save();

    res.json({
      message: "Тестовые данные успешно созданы",
      publisher,
      magazines: [magazine1, magazine2],
      tags: [tag1, tag2],
      articles: [article1, article2],
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании тестовых данных",
      error: error.message,
    });
  }
});

// Получить Publisher вместе с журналами
app.get("/publishers", async (req, res) => {
  try {
    const publishers = await Publisher.find();
    const magazines = await Magazine.find().populate("publisher");

    res.json({
      publishers,
      magazines,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить Article с тегами и Tag со статьями
app.get("/articles-tags", async (req, res) => {
  try {
    const articles = await Article.find().populate("tags");
    const tags = await Tag.find().populate("articles");

    res.json({
      articles,
      tags,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});