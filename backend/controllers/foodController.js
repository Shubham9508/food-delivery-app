const Food = require('../models/Food');

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name/description if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const foods = await Food.find(query);
    res.status(200).json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
exports.getFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item (Admin)
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res, next) => {
  try {
    const { name, description, price, image, category, isAvailable, rating } = req.body;

    const food = await Food.create({
      name,
      description,
      price,
      image,
      category,
      isAvailable,
      rating,
    });

    res.status(201).json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item (Admin)
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res, next) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item (Admin)
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    await food.deleteOne();
    res.status(200).json({ success: true, message: 'Food item removed successfully' });
  } catch (error) {
    next(error);
  }
};
