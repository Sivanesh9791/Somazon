const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Apple iPhone 15',
    description: 'Latest iPhone with A16 chip, 48MP camera',
    price: 999,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Samsung 4K Smart TV 55inch',
    description: 'Crystal clear 4K display with smart features',
    price: 799,
    image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400',
    category: 'Electronics',
    brand: 'Samsung',
    countInStock: 5,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Nike Air Max Sneakers',
    description: 'Comfortable and stylish running shoes',
    price: 120,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Footwear',
    brand: 'Nike',
    countInStock: 20,
    rating: 4.7,
    numReviews: 25,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry leading noise cancelling headphones',
    price: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 15,
    rating: 4.8,
    numReviews: 30,
  },
  {
    name: 'Leather Laptop Bag',
    description: 'Premium leather bag fits laptops up to 15 inch',
    price: 89,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Bags',
    brand: 'Urban',
    countInStock: 8,
    rating: 4.3,
    numReviews: 15,
  },
  {
    name: 'Canon EOS R50 Camera',
    description: 'Mirrorless camera perfect for beginners and creators',
    price: 679,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    category: 'Electronics',
    brand: 'Canon',
    countInStock: 6,
    rating: 4.6,
    numReviews: 18,
  },
];

const importData = async () => {
  try {
    connectDB();

    await Product.deleteMany();
    await Product.insertMany(sampleProducts);

    console.log('Sample products imported successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
