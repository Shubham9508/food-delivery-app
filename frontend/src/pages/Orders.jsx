import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Package, Clock, ShieldCheck, MapPin, Phone, Truck } from 'lucide-react';
import { formatInr } from '../utils/currency';

const ORDER_STATUS_STEPS = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/user');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-500 text-white';
      case 'Preparing': return 'bg-amber-500 text-white';
      case 'Out for Delivery': return 'bg-indigo-500 text-white';
      case 'Delivered': return 'bg-emerald-500 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStepIndex = (status) => {
    return ORDER_STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkBg-primary min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2.5 mb-8">
        <Package className="text-primary-500" size={26} />
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Order History</h1>
      </div>

      {loading ? (
        /* Loading skeleton */
        <div className="space-y-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-darkBg-secondary animate-pulse-slow">
              <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
              <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded mb-4" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 px-4 text-center shadow-premium dark:bg-darkBg-secondary border border-slate-100 dark:border-slate-800">
          <div className="rounded-full bg-slate-50 p-6 dark:bg-darkBg-primary">
            <Package size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">No orders placed yet</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-[280px]">
            You haven't ordered anything yet. Browse our delicious menu and place your first order.
          </p>
        </div>
      ) : (
        /* Order Cards List */
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-premium dark:border-slate-800 dark:bg-darkBg-secondary"
              >
                {/* Order Top Bar Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-darkBg-primary/20">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white font-mono truncate max-w-[180px]">
                      {order._id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Placed</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grand Total</span>
                    <span className="text-sm font-extrabold text-primary-500">{formatInr(order.totalAmount)}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Main Body */}
                <div className="p-6">
                  {/* Items List */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          {item.food && (
                            <img
                              src={item.food.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</p>
                            <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          {formatInr(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location Panel */}
                  <div className="mt-6 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 dark:bg-darkBg-primary/20 border border-slate-100 dark:border-slate-800/40 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 text-primary-500" />
                      <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-800 dark:text-white">Address:</strong> {order.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-primary-500" />
                      <span className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-800 dark:text-white">Phone:</strong> {order.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary-500" />
                      <span className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-800 dark:text-white">Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Interactive Status Visual Progress Tracker (if not cancelled) */}
                  {!isCancelled && (
                    <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                      <div className="flex justify-between relative">
                        {/* Progress Connection Line */}
                        <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-slate-100 dark:bg-slate-800 z-0">
                          <div
                            className="h-full bg-primary-500 transition-all duration-500"
                            style={{
                              width: `${currentStepIdx >= 0 ? (currentStepIdx / (ORDER_STATUS_STEPS.length - 1)) * 100 : 0}%`,
                            }}
                          />
                        </div>

                        {ORDER_STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStepIdx;
                          const isActive = idx === currentStepIdx;

                          return (
                            <div key={step} className="flex flex-col items-center z-10 text-center w-[22%]">
                              {/* Step circle */}
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-primary-500 text-white shadow-md'
                                  : 'bg-white text-slate-400 border-2 border-slate-100 dark:bg-darkBg-secondary dark:border-slate-800'
                              } ${isActive ? 'ring-4 ring-primary-500/20' : ''}`}>
                                {idx === 0 && <Clock size={16} />}
                                {idx === 1 && <Package size={16} />}
                                {idx === 2 && <Truck size={16} />}
                                {idx === 3 && <ShieldCheck size={16} />}
                              </div>
                              {/* Step label */}
                              <span className={`mt-2 text-[10px] sm:text-xs font-bold tracking-wide transition ${
                                isCompleted ? 'text-slate-800 dark:text-white' : 'text-slate-400'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
