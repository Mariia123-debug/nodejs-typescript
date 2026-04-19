const express = require('express');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const { connectDB, getDB } = require('./db');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

/*
  CREATE
  POST /products
*/
app.post('/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || price === undefined || !description) {
      return res.status(400).json({
        message: 'Fields name, price and description are required',
      });
    }

    const newProduct = {
      name,
      price,
      description,
    };

    const db = getDB();
    const result = await db.collection('products').insertOne(newProduct);

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while creating product',
      error: error.message,
    });
  }
});

/*
  READ ALL
  GET /products
*/
app.get('/products', async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection('products').find().toArray();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching products',
      error: error.message,
    });
  }
});

/*
  READ ONE
  GET /products/:id
*/
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    const db = getDB();
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching product',
      error: error.message,
    });
  }
});

/*
  UPDATE
  PUT /products/:id
*/
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    if (!name || price === undefined || !description) {
      return res.status(400).json({
        message: 'Fields name, price and description are required',
      });
    }

    const updatedProduct = {
      name,
      price,
      description,
    };

    const db = getDB();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while updating product',
      error: error.message,
    });
  }
});

/*
  DELETE
  DELETE /products/:id
*/
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    const db = getDB();
    const result = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while deleting product',
      error: error.message,
    });
  }
});

/*
  Start server only after DB connection
*/
async function startServer() {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
}

startServer();