import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, CreditCard, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { formatInr } from '../utils/currency';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pre-fill user details if available
  useEffect(() => {
    if (user) {
      if (user.address) setAddress(user.address);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Redirect if cart is empty (unless order was just successful)
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [cart, orderSuccess, navigate]);

  const deliveryFee = cartTotal > 30 ? 0 : 3.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to complete your checkout');
      return navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }

    if (!address) return toast.error('Please provide a delivery address');
    if (!phone) return toast.error('Please provide a contact phone number');

    setSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        foodId: item.food._id,
        quantity: item.quantity,
      }));

      await API.post('/orders', {
        items: orderItems,
        address,
        phone,
        paymentMethod,
      });

      // Clear basket database-side / local storage
      await clearCart();
      
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to place order.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-darkBg-primary">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-premium border border-slate-100 dark:bg-darkBg-secondary dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500">
            <CheckCircle size={36} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">Order Confirmed!</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Your chef is preparing your meal right now. We will deliver it warm and fresh to your address.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="rounded-xl bg-primary-500 py-3 text-sm font-extrabold text-white hover:bg-primary-600 shadow-md"
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkBg-primary min-h-[calc(100vh-4rem)]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Back to Basket
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-premium dark:bg-darkBg-secondary border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Delivery Details
            </h2>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Delivery Address
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3 text-slate-400">
                  <MapPin size={16} />
                </div>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address, Apartment/Suite, City, State, ZIP Code"
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  paymentMethod === 'COD'
                    ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="text-primary-500">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Cash on Delivery</p>
                      <p className="text-xs text-slate-400">Pay when order arrives</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="h-4 w-4 text-primary-500 accent-primary-500"
                  />
                </label>

                {/* Card Payment */}
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  paymentMethod === 'Card'
                    ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="text-primary-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Online Card (Mock)</p>
                      <p className="text-xs text-slate-400">Secure digital payment</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="h-4 w-4 text-primary-500 accent-primary-500"
                  />
                </label>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-4 text-base font-extrabold text-white transition hover:bg-primary-600 hover:shadow-premium disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {submitting ? 'Processing Order...' : `Place Order - ${formatInr(grandTotal)}`}
            </button>
          </form>
        </div>

        {/* Order Items Breakdown Sidebar */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white p-6 shadow-premium dark:bg-darkBg-secondary border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Basket Summary
            </h2>

            {/* Basket Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.food._id} className="flex justify-between py-3 text-sm">
                  <div className="flex gap-2">
                    <span className="font-extrabold text-primary-500">{item.quantity}x</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.food.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatInr(item.food.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Items Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white">{formatInr(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {deliveryFee === 0 ? 'FREE' : formatInr(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sales Tax (8%)</span>
                <span className="font-bold text-slate-800 dark:text-white">{formatInr(tax)}</span>
              </div>
              <div className="border-t border-slate-200 border-dashed dark:border-slate-800 pt-3 flex justify-between text-base font-bold">
                <span className="text-slate-800 dark:text-white">Grand Total</span>
                <span className="text-primary-500">{formatInr(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
