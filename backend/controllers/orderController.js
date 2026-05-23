const Order = require('../models/Order');
const Food = require('../models/Food');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, address, phone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Verify items and calculate total amount
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const foodItem = await Food.findById(item.foodId);
      if (!foodItem) {
        return res.status(404).json({ success: false, message: `Food item ${item.foodId} not found` });
      }

      const itemTotal = foodItem.price * item.quantity;
      totalAmount += itemTotal;

      verifiedItems.push({
        food: foodItem._id,
        name: foodItem.name,
        quantity: item.quantity,
        price: foodItem.price,
      });
    }

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      items: verifiedItems,
      totalAmount,
      address,
      phone,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Card' ? 'Completed' : 'Pending', // Mock payment check
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.food')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.food')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type' });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }
    
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
