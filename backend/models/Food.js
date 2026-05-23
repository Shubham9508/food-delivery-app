const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a food item name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL or file path'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Pizza', 'Burger', 'Sushi', 'Dessert', 'Salad', 'Beverage', 'Pasta', 'Chinese', 'Indian', 'Appetizer'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Food', FoodSchema);
