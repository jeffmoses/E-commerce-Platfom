const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: [99, 'Cannot add more than 99 items of the same product']
  },
  image: {
    type: String,
    required: true
  },
  selectedOptions: {
    type: Map,
    of: String
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ user: 1 }, { unique: true });

// Virtual for checking if cart is empty
cartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(product, quantity = 1, options = {}) {
  const existingItem = this.items.find(item =>
    item.product.toString() === product._id.toString() &&
    JSON.stringify(item.selectedOptions) === JSON.stringify(options)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || '',
      selectedOptions: options
    });
  }
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, options = {}) {
  this.items = this.items.filter(item =>
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedOptions) === JSON.stringify(options))
  );
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, options = {}) {
  const item = this.items.find(item =>
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedOptions) === JSON.stringify(options)
  );

  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId, options);
    } else {
      item.quantity = Math.min(quantity, 99);
    }
  }
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalItems = 0;
  this.totalPrice = 0;
};

module.exports = mongoose.model('Cart', cartSchema);
