import React, { useState, useEffect } from 'react';
import API from '../services/api';
import FoodCard from '../components/FoodCard';
import { Search, MapPin, Compass, Flame, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All', 'Pizza', 'Burger', 'Sushi', 'Dessert', 'Salad', 'Beverage', 'Pasta', 'Chinese', 'Indian', 'Appetizer'
];

const MOCK_FOODS = [
  {
    _id: 'mock-1',
    name: 'Gourmet Margherita Pizza',
    description: 'Fresh mozzarella, san marzano tomatoes, fresh basil, and extra virgin olive oil on our house-made sourdough crust.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80',
    category: 'Pizza',
    rating: 4.8,
    isAvailable: true
  },
  {
    _id: 'mock-2',
    name: 'Pepperoni Supreme Pizza',
    description: 'Double layer of spicy pepperoni, mozzarella cheese, and rich marinara sauce with Italian herbs.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    category: 'Pizza',
    rating: 4.7,
    isAvailable: true
  },
  {
    _id: 'mock-3',
    name: 'Classic Cheeseburger',
    description: 'Flame-grilled prime angus beef patty, cheddar cheese, crisp lettuce, ripe tomato, pickles, and our signature burger sauce on a toasted brioche bun.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'Burger',
    rating: 4.6,
    isAvailable: true
  },
  {
    _id: 'mock-4',
    name: 'Smoked Bacon Avocado Burger',
    description: 'Angus beef patty with crispy hardwood-smoked bacon, fresh avocado slices, Swiss cheese, and garlic aioli.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    category: 'Burger',
    rating: 4.9,
    isAvailable: true
  },
  {
    _id: 'mock-5',
    name: 'Premium Sushi Platter',
    description: 'Assortment of fresh nigiri (salmon, tuna, shrimp) and specialty rolls including California and Spicy Tuna rolls.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    category: 'Sushi',
    rating: 4.8,
    isAvailable: true
  },
  {
    _id: 'mock-6',
    name: 'Dragon Roll',
    description: 'Eel and cucumber inside, wrapped with thin avocado slices on the outside, topped with sweet unagi sauce and sesame seeds.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80',
    category: 'Sushi',
    rating: 4.7,
    isAvailable: true
  },
  {
    _id: 'mock-7',
    name: 'Tiramisu Classico',
    description: 'Layers of espresso-soaked ladyfingers and creamy mascarpone, dusted with rich cocoa powder.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    category: 'Dessert',
    rating: 4.9,
    isAvailable: true
  },
  {
    _id: 'mock-8',
    name: 'Fudge Chocolate Brownie',
    description: 'Warm, gooey chocolate brownie loaded with chocolate chunks, served with a chocolate drizzle.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    category: 'Dessert',
    rating: 4.5,
    isAvailable: true
  },
  {
    _id: 'mock-9',
    name: 'Avocado Quinoa Salad',
    description: 'Fresh mixed greens, organic quinoa, ripe avocado, cherry tomatoes, cucumbers, and feta cheese tossed in a lemon vinaigrette.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    category: 'Salad',
    rating: 4.4,
    isAvailable: true
  },
  {
    _id: 'mock-10',
    name: 'Fresh Berry Smoothie',
    description: 'A refreshing blend of fresh strawberries, blueberries, raspberries, Greek yogurt, and a touch of honey.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=600&q=80',
    category: 'Beverage',
    rating: 4.5,
    isAvailable: true
  },
  {
    _id: 'mock-11',
    name: 'Creamy Fettuccine Alfredo',
    description: 'Fettuccine pasta tossed in a rich, velvety Parmesan cream sauce with a touch of fresh garlic.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    category: 'Pasta',
    rating: 4.6,
    isAvailable: true
  },
  {
    _id: 'mock-12',
    name: 'Szechuan Chili Chicken',
    description: 'Tender chicken bites stir-fried with bell peppers, onions, and dried chilies in a spicy, savory Szechuan sauce.',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    category: 'Chinese',
    rating: 4.7,
    isAvailable: true
  },
  {
    _id: 'mock-13',
    name: 'Butter Chicken with Naan',
    description: 'Tender tandoori chicken cooked in a rich, creamy spiced tomato butter sauce, served with freshly baked butter garlic naan.',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    category: 'Indian',
    rating: 4.9,
    isAvailable: true
  },
  {
    _id: 'mock-14',
    name: 'Crispy Garlic Bruschetta',
    description: 'Toasted baguette slices topped with tomatoes, garlic, fresh basil, and a sweet balsamic glaze.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
    category: 'Appetizer',
    rating: 4.5,
    isAvailable: true
  }
];

const Home = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to prevent excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const getFilteredMockFoods = () => {
    return MOCK_FOODS.filter((food) => {
      const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
      const matchesSearch =
        !debouncedSearch ||
        food.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        food.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Fetch foods on category, search query, or login state change
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const res = await API.get('/foods', {
          params: {
            category: activeCategory,
            search: debouncedSearch,
          },
        });
        if (res.data && res.data.data && res.data.data.length > 0) {
          setFoods(res.data.data);
        } else {
          // If the backend has no seeded data, fall back to mock food listings.
          setFoods(getFilteredMockFoods());
        }
      } catch (err) {
        console.error('Error fetching food items', err);
        setFoods(getFilteredMockFoods());
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [activeCategory, debouncedSearch, user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white dark:bg-darkBg-primary">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-400">
            <Flame size={12} /> Satisfying cravings 24/7
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Savor Premium Gourmet <br />
            <span className="text-primary-500">Meals Delivered Instant</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            Choose from the city's finest artisan kitchens. Fresh, piping hot ingredients cooked to perfection and delivered right to your door.
          </p>

          {/* Premium Search Container */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-2.5 shadow-xl dark:bg-darkBg-secondary sm:flex-row sm:items-center">
              {/* Mock Location */}
              <div className="flex flex-1 items-center gap-2 border-b border-slate-100 pb-3 pl-3 dark:border-slate-800 sm:border-b-0 sm:border-r sm:pb-0">
                <MapPin className="text-primary-500" size={18} />
                <input
                  type="text"
                  placeholder="New York, NY"
                  disabled
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                />
              </div>

              {/* Search Food Input */}
              <div className="flex flex-[2] items-center gap-2 pl-3">
                <Search className="text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pizza, burger, desserts..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="text-primary-500" size={22} />
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              Explore Cuisines
            </h2>
          </div>
          
          {/* Horizontal Scroller */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide transition-all ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 dark:bg-darkBg-secondary dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Food Card Grid */}
        <section>
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-darkBg-secondary">
                  <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800 animate-pulse-slow" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse-slow" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse-slow" />
                    <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse-slow" />
                    <div className="mt-2 flex justify-between items-center">
                      <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse-slow" />
                      <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse-slow" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : foods.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-slate-50 p-6 dark:bg-darkBg-secondary">
                <Search size={40} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">No items found</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-[280px]">
                We couldn't find any dishes matching "{searchQuery}" under "{activeCategory}".
              </p>
            </div>
          ) : (
            /* Main Cards */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
