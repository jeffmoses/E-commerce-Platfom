const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const { app } = require('../app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Product API Tests', () => {
  let adminToken;
  let userToken;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce-test');

    // Create test users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123'
    });

    // Generate tokens
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'your-secret-key');
    userToken = jwt.sign({ id: regularUser._id }, process.env.JWT_SECRET || 'your-secret-key');
  });

  after(async () => {
    // Clean up and close connection
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: 'Test Product 1',
          description: 'Description 1',
          price: 29.99,
          category: 'electronics',
          brand: 'Test Brand',
          images: [{ url: 'http://example.com/image1.jpg', alt: 'Image 1' }],
          inventory: { quantity: 10, lowStockThreshold: 5 }
        },
        {
          name: 'Test Product 2',
          description: 'Description 2',
          price: 49.99,
          category: 'clothing',
          brand: 'Test Brand 2',
          images: [{ url: 'http://example.com/image2.jpg', alt: 'Image 2' }],
          inventory: { quantity: 5, lowStockThreshold: 2 }
        }
      ]);
    });

    it('should get all products', async () => {
      const res = await chai.request(app)
        .get('/api/products');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(2);
    });

    it('should filter products by category', async () => {
      const res = await chai.request(app)
        .get('/api/products?category=electronics');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.lengthOf(1);
      expect(res.body.data[0].category).to.equal('electronics');
    });

    it('should search products by text', async () => {
      const res = await chai.request(app)
        .get('/api/products?search=Product 1');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.lengthOf(1);
      expect(res.body.data[0].name).to.equal('Test Product 1');
    });
  });

  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: 19.99,
        category: 'books',
        brand: 'New Brand',
        images: [{ url: 'http://example.com/new-image.jpg', alt: 'New Image' }],
        inventory: { quantity: 20, lowStockThreshold: 5 }
      };

      const res = await chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data.name).to.equal('New Product');
    });

    it('should not create product as regular user', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: 19.99,
        category: 'books',
        brand: 'New Brand',
        images: [{ url: 'http://example.com/new-image.jpg', alt: 'New Image' }],
        inventory: { quantity: 20, lowStockThreshold: 5 }
      };

      const res = await chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(res).to.have.status(403);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('PUT /api/products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        name: 'Update Test Product',
        description: 'Description',
        price: 29.99,
        category: 'electronics',
        brand: 'Test Brand',
        images: [{ url: 'http://example.com/image.jpg', alt: 'Image' }],
        inventory: { quantity: 10, lowStockThreshold: 5 }
      });
    });

    it('should update product as admin', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 39.99
      };

      const res = await chai.request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data.name).to.equal('Updated Product Name');
      expect(res.body.data.price).to.equal(39.99);
    });

    it('should not update product as regular user', async () => {
      const updateData = {
        name: 'Updated Product Name'
      };

      const res = await chai.request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res).to.have.status(403);
      expect(res.body).to.have.property('success', false);
    });
  });
});
