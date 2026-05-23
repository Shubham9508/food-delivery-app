const express = require('express');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.get('/user', protect, getUserOrders);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
