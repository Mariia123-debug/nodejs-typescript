import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Проверочный маршрут
app.get("/", (req, res) => {
  res.send("Server is running");
});


// =========================
// CATEGORY ROUTES
// =========================

// Получить все категории
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error getting categories", error: error.message });
  }
});

// Добавить категорию
app.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});


// =========================
// PRODUCT ROUTES
// =========================

// Получить все продукты с category через populate
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error getting products", error: error.message });
  }
});

// Добавить продукт
app.post("/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const newProduct = new Product({
      name,
      price,
      category
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});