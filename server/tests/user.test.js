const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/User');
const { app } = require('../app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('User API Tests', () => {
  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce-test');
  });

  after(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await chai.request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', 'Test User');
      expect(res.body.data).to.have.property('email', 'test@example.com');
      expect(res.body.data).to.not.have.property('password');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Create user first
      await User.create(userData);

      // Try to register again
      const res = await chai.request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('User already exists');
    });

    it('should validate required fields', async () => {
      const res = await chai.request(app)
        .post('/api/users/register')
        .send({});

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      await User.create(userData);
    });

    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await chai.request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
      expect(res.body.data).to.have.property('email', 'test@example.com');
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await chai.request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });
});
