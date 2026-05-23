require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Food = require('./models/Food');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const foods = [
  {
    name: 'Gourmet Margherita Pizza',
    description: 'Fresh mozzarella, san marzano tomatoes, fresh basil, and extra virgin olive oil on our house-made sourdough crust.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80',
    category: 'Pizza',
    rating: 4.8,
    isAvailable: true
  },
  {
    name: 'Pepperoni Supreme Pizza',
    description: 'Double layer of spicy pepperoni, mozzarella cheese, and rich marinara sauce with Italian herbs.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    category: 'Pizza',
    rating: 4.7,
    isAvailable: true
  },
  {
    name: 'Classic Cheeseburger',
    description: 'Flame-grilled prime angus beef patty, cheddar cheese, crisp lettuce, ripe tomato, pickles, and our signature burger sauce on a toasted brioche bun.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'Burger',
    rating: 4.6,
    isAvailable: true
  },
  {
    name: 'Smoked Bacon Avocado Burger',
    description: 'Angus beef patty with crispy hardwood-smoked bacon, fresh avocado slices, Swiss cheese, and garlic aioli.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    category: 'Burger',
    rating: 4.9,
    isAvailable: true
  },
  {
    name: 'Premium Sushi Platter',
    description: 'Assortment of fresh nigiri (salmon, tuna, shrimp) and specialty rolls including California and Spicy Tuna rolls.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    category: 'Sushi',
    rating: 4.8,
    isAvailable: true
  },
  {
    name: 'Dragon Roll',
    description: 'Eel and cucumber inside, wrapped with thin avocado slices on the outside, topped with sweet unagi sauce and sesame seeds.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80',
    category: 'Sushi',
    rating: 4.7,
    isAvailable: true
  },
  {
    name: 'Tiramisu Classico',
    description: 'Layers of espresso-soaked ladyfingers and creamy mascarpone, dusted with rich cocoa powder.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    category: 'Dessert',
    rating: 4.9,
    isAvailable: true
  },
  {
    name: 'Fudge Chocolate Brownie',
    description: 'Warm, gooey chocolate brownie loaded with chocolate chunks, served with a chocolate drizzle.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    category: 'Dessert',
    rating: 4.5,
    isAvailable: true
  },
  {
    name: 'Avocado Quinoa Salad',
    description: 'Fresh mixed greens, organic quinoa, ripe avocado, cherry tomatoes, cucumbers, and feta cheese tossed in a lemon vinaigrette.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    category: 'Salad',
    rating: 4.4,
    isAvailable: true
  },
  {
    name: 'Fresh Berry Smoothie',
    description: 'A refreshing blend of fresh strawberries, blueberries, raspberries, Greek yogurt, and a touch of honey.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=600&q=80',
    category: 'Beverage',
    rating: 4.5,
    isAvailable: true
  },
  {
    name: 'Creamy Fettuccine Alfredo',
    description: 'Fettuccine pasta tossed in a rich, velvety Parmesan cream sauce with a touch of fresh garlic.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    category: 'Pasta',
    rating: 4.6,
    isAvailable: true
  },
  {
    name: 'Szechuan Chili Chicken',
    description: 'Tender chicken bites stir-fried with bell peppers, onions, and dried chilies in a spicy, savory Szechuan sauce.',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    category: 'Chinese',
    rating: 4.7,
    isAvailable: true
  },
  {
    name: 'Butter Chicken with Naan',
    description: 'Tender tandoori chicken cooked in a rich, creamy spiced tomato butter sauce, served with freshly baked butter garlic naan.',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    category: 'Indian',
    rating: 4.9,
    isAvailable: true
  },
  {
    name: 'Crispy Garlic Bruschetta',
    description: 'Toasted baguette slices topped with tomatoes, garlic, fresh basil, and a sweet balsamic glaze.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
    category: 'Appetizer',
    rating: 4.5,
    isAvailable: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Food.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('Database cleared!');

    // Create Admin User
    const admin = await User.create({
      name: 'Chef Admin',
      email: 'admin@fooddelivery.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      address: 'Central Kitchen HQ, Sector 5, Tech City'
    });
    console.log('Admin account created (admin@fooddelivery.com / admin123)');

    // Create Customer User
    const customer = await User.create({
      name: 'Jane Doe',
      email: 'user@fooddelivery.com',
      password: 'user123',
      role: 'customer',
      phone: '9876543211',
      address: 'Apartment 4B, Green Valley Heights, Sector 12'
    });
    console.log('Customer account created (user@fooddelivery.com / user123)');

    // Insert Food Items
    await Food.insertMany(foods);
    console.log('Sample food items inserted successfully!');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
