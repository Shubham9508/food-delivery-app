const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
    
    // If cart doesn't exist, create an empty one
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update food item in cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;
    const addQty = quantity ? parseInt(quantity) : 1;

    // Check if food exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += addQty;
    } else {
      // Item doesn't exist, add new item
      cart.items.push({ food: foodId, quantity: addQty });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    
    // Populate food before sending back
    await cart.populate('items.food');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove or decrement food item in cart
// @route   POST /api/cart/remove
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { foodId, removeAll } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (removeAll || cart.items[itemIndex].quantity <= 1) {
      // Remove completely
      cart.items.splice(itemIndex, 1);
    } else {
      // Decrement quantity
      cart.items[itemIndex].quantity -= 1;
    }

    cart.updatedAt = Date.now();
    await cart.save();
    
    await cart.populate('items.food');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   POST /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
