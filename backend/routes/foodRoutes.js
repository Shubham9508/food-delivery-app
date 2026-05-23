const express = require('express');
const {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(protect, authorize('admin'), createFood);

router.route('/:id')
  .get(getFood)
  .put(protect, authorize('admin'), updateFood)
  .delete(protect, authorize('admin'), deleteFood);

module.exports = router;
