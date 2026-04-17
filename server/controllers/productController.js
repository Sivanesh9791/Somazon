const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new Error('Product not found');
  }
  res.json(product);
});

// Create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, brand, countInStock } =
    req.body;

  const product = new Product({
    name,
    description,
    price,
    image,
    category,
    brand,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, brand, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new Error('Product not found');
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.image = image || product.image;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.countInStock = countInStock || product.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
