import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Plus, Minus, Check } from 'lucide-react';
import { formatInr } from '../utils/currency';

const placeholderImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';

const FoodCard = ({ food }) => {
  const { cart, addToCart, removeFromCart } = useCart();

  // Find if this item is in the cart to render cart increment/decrement options
  const cartItem = cart.find((item) => item.food?._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="card-hover-effect group flex flex-col overflow-hidden rounded-2xl bg-white shadow-premium dark:bg-darkBg-secondary">
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={food.image || placeholderImage}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholderImage;
          }}
        />
        {/* Rating overlay */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-darkBg-secondary/95 dark:text-white">
          <Star size={12} className="fill-amber-400 stroke-amber-400" />
          <span>{food.rating.toFixed(1)}</span>
        </div>
        {/* Category tag */}
        <div className="absolute left-3 top-3 rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
          {food.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 dark:text-white">
          {food.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400 flex-1">
          {food.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          {/* Price */}
          <div>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Price</span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formatInr(food.price)}
            </p>
          </div>

          {/* Add to Cart Actions */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-50/50 p-1 dark:bg-primary-950/20">
              <button
                onClick={() => removeFromCart(food._id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-500 transition hover:bg-primary-500 hover:text-white dark:bg-darkBg-secondary"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[20px] text-center text-sm font-extrabold text-primary-600 dark:text-primary-400">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(food)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-500 transition hover:bg-primary-500 hover:text-white dark:bg-darkBg-secondary"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food)}
              disabled={!food.isAvailable}
              className="flex items-center gap-1.5 rounded-full bg-primary-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600 hover:shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {food.isAvailable ? (
                <>
                  <Plus size={14} /> Add
                </>
              ) : (
                'Sold Out'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
