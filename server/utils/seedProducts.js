const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  // Adult Clothes
  {
    name: 'Men\'s Casual Shirt',
    description: 'Comfortable cotton shirt for everyday wear.',
    price: 29.99,
    category: 'clothing',
    brand: 'BrandA',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Mens+Shirt', alt: 'Men\'s Casual Shirt' }],
    inventory: { quantity: 50, lowStockThreshold: 10 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Women\'s Dress',
    description: 'Elegant dress perfect for occasions.',
    price: 49.99,
    category: 'clothing',
    brand: 'BrandB',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Womens+Dress', alt: 'Women\'s Dress' }],
    inventory: { quantity: 30, lowStockThreshold: 5 },
    isActive: true,
    isFeatured: false
  },
  // Children's Clothes
  {
    name: 'Kids T-Shirt',
    description: 'Fun and colorful t-shirt for kids.',
    price: 14.99,
    category: 'clothing',
    brand: 'BrandC',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Kids+T-Shirt', alt: 'Kids T-Shirt' }],
    inventory: { quantity: 40, lowStockThreshold: 8 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Children\'s Jeans',
    description: 'Durable jeans for active kids.',
    price: 24.99,
    category: 'clothing',
    brand: 'BrandD',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Childrens+Jeans', alt: 'Children\'s Jeans' }],
    inventory: { quantity: 25, lowStockThreshold: 5 },
    isActive: true,
    isFeatured: false
  },
  // Adult Shoes
  {
    name: 'Men\'s Running Shoes',
    description: 'High-performance running shoes.',
    price: 79.99,
    category: 'sports',
    brand: 'BrandE',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Mens+Running+Shoes', alt: 'Men\'s Running Shoes' }],
    inventory: { quantity: 20, lowStockThreshold: 3 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Women\'s Sneakers',
    description: 'Stylish sneakers for everyday use.',
    price: 59.99,
    category: 'sports',
    brand: 'BrandF',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Womens+Sneakers', alt: 'Women\'s Sneakers' }],
    inventory: { quantity: 35, lowStockThreshold: 7 },
    isActive: true,
    isFeatured: false
  },
  // Children's Shoes
  {
    name: 'Kids Sneakers',
    description: 'Comfortable sneakers for kids.',
    price: 34.99,
    category: 'sports',
    brand: 'BrandG',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Kids+Sneakers', alt: 'Kids Sneakers' }],
    inventory: { quantity: 45, lowStockThreshold: 9 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Children\'s Boots',
    description: 'Warm boots for winter.',
    price: 44.99,
    category: 'sports',
    brand: 'BrandH',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Childrens+Boots', alt: 'Children\'s Boots' }],
    inventory: { quantity: 15, lowStockThreshold: 2 },
    isActive: true,
    isFeatured: false
  }
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany(); // Clear existing products for fresh seed
    await Product.insertMany(sampleProducts);

    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
