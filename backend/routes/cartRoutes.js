const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/')
  .get(getCart);

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

module.exports = router;
