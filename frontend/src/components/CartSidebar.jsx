import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { formatInr } from '../utils/currency';

const CartSidebar = () => {
  const { cart, cartOpen, setCartOpen, addToCart, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const deliveryFee = cartTotal > 30 ? 0 : 3.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 dark:bg-darkBg-secondary flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-primary-500" size={22} />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Basket</h2>
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-full bg-slate-50 p-6 dark:bg-darkBg-primary">
                  <ShoppingBag size={48} className="text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">Your cart is empty</h3>
                <p className="mt-2 text-xs text-slate-400 max-w-[240px]">
                  Add some delicious meals from our kitchen to satisfy your cravings.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 rounded-full bg-primary-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-600"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => {
                  if (!item.food) return null;
                  return (
                    <div
                      key={item.food._id}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-darkBg-primary/20"
                    >
                      {/* Food image */}
                      <img
                        src={item.food.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'}
                        alt={item.food.name}
                        className="h-16 w-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
                        }}
                      />

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                          {item.food.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {formatInr(item.food.price)} each
                        </p>
                        <p className="mt-1 font-extrabold text-sm text-slate-900 dark:text-white">
                          {formatInr(item.food.price * item.quantity)}
                        </p>
                      </div>

                      {/* Item adjustments */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5 rounded-full bg-white p-1 shadow-sm border border-slate-100 dark:bg-darkBg-secondary dark:border-slate-800">
                          <button
                            onClick={() => removeFromCart(item.food._id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-[14px] text-center text-xs font-bold text-slate-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.food)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.food._id, true)}
                          className="text-slate-300 hover:text-red-500 dark:text-slate-600"
                          aria-label="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Receipt Summary */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-darkBg-primary/40">
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{formatInr(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {deliveryFee === 0 ? 'FREE' : formatInr(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST / Tax (8%)</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{formatInr(tax)}</span>
                </div>
                <div className="my-2 border-t border-slate-200 border-dashed dark:border-slate-800" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-800 dark:text-white">Total</span>
                  <span className="text-primary-500">{formatInr(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3.5 text-sm font-extrabold text-white transition hover:bg-primary-600 hover:shadow-premium"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
