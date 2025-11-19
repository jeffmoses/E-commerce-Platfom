const express = require('express');
const Joi = require('joi');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).max(99).default(1),
  options: Joi.object()
});

const updateCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(0).max(99).required(),
  options: Joi.object()
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Validate input
    const { error } = addToCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { productId, quantity, options = {} } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    cart.addItem(product, quantity, options);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update cart item
// @route   PUT /api/cart
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    // Validate input
    const { error } = updateCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { productId, quantity, options = {} } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    if (quantity === 0) {
      // Remove item
      cart.removeItem(productId, options);
    } else {
      // Check stock availability if increasing quantity
      const existingItem = cart.items.find(item =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(options)
      );

      if (existingItem && quantity > existingItem.quantity) {
        const product = await Product.findById(productId);
        if (product && product.inventory.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }
      }

      // Update quantity
      cart.updateItemQuantity(productId, quantity, options);
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const options = req.query.options ? JSON.parse(req.query.options) : {};
    cart.removeItem(req.params.productId, options);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.clearCart();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/merge
// @access  Private
router.post('/merge', protect, async (req, res) => {
  try {
    const { guestCart } = req.body;

    if (!guestCart || !Array.isArray(guestCart)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid guest cart data'
      });
    }

    // Get or create user cart
    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, items: [] });
    }

    // Merge guest cart items
    for (const guestItem of guestCart) {
      const product = await Product.findById(guestItem.product);
      if (product && product.isActive && product.inventory.quantity >= guestItem.quantity) {
        userCart.addItem(product, guestItem.quantity, guestItem.selectedOptions || {});
      }
    }

    await userCart.save();
    await userCart.populate('items.product');

    res.status(200).json({
      success: true,
      data: userCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
