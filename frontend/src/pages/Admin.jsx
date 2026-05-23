import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Shield, Plus, Edit, Trash2, Check, RefreshCw, X, FileText, Users, ShoppingBag } from 'lucide-react';
import { formatInr } from '../utils/currency';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tab State: 'menu' | 'orders' | 'users'
  const [activeTab, setActiveTab] = useState('menu');

  // Backend Entities State
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedFoodId, setSelectedFoodId] = useState(null);

  // Food Form Fields
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Pizza',
    isAvailable: true,
  });

  // Protect Admin Route: Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access Denied: Administrative access required');
      navigate('/');
    }
  }, [user, navigate]);

  // Load appropriate data based on active tab
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchTabData();
    }
  }, [activeTab, user]);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'menu') {
        const res = await API.get('/foods');
        setFoods(res.data.data);
      } else if (activeTab === 'orders') {
        const res = await API.get('/orders');
        setOrders(res.data.data);
      } else if (activeTab === 'users') {
        const res = await API.get('/admin/users');
        setUsersList(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load administrative records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- FOOD CRUD HANDLERS ---
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFoodForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'Pizza',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (food) => {
    setModalMode('edit');
    setSelectedFoodId(food._id);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category,
      isAvailable: food.isAvailable,
    });
    setShowModal(true);
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.image || !foodForm.description) {
      return toast.error('Please complete all form fields');
    }

    try {
      const payload = { ...foodForm, price: parseFloat(foodForm.price) };
      
      if (modalMode === 'add') {
        await API.post('/foods', payload);
        toast.success('Food item created successfully!');
      } else {
        await API.put(`/foods/${selectedFoodId}`, payload);
        toast.success('Food item updated successfully!');
      }

      setShowModal(false);
      fetchTabData();
    } catch (err) {
      toast.error('Failed to save food item details');
      console.error(err);
    }
  };

  const handleFoodDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await API.delete(`/foods/${id}`);
      toast.success('Food item deleted.');
      fetchTabData();
    } catch (err) {
      toast.error('Failed to delete food item');
    }
  };

  // --- ORDER STATUS HANDLERS ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to '${newStatus}'`);
      fetchTabData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // --- USER HANDLERS ---
  const handleToggleUserRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change ${targetUser.name}'s permission level to '${nextRole}'?`)) return;
    try {
      await API.put(`/admin/users/${targetUser._id}/role`, { role: nextRole });
      toast.success('User privileges modified successfully');
      fetchTabData();
    } catch (err) {
      toast.error('Failed to change user roles');
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully.');
      fetchTabData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkBg-primary min-h-[calc(100vh-4rem)]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-rose-500/10 p-3 text-rose-500">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Admin Hub</h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Control Panel & Analytics</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-xl bg-slate-200/50 p-1 dark:bg-darkBg-secondary/50">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-white text-slate-800 shadow-sm dark:bg-darkBg-primary dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText size={16} /> Menu Items
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-slate-800 shadow-sm dark:bg-darkBg-primary dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <ShoppingBag size={16} /> Orders List
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-800 shadow-sm dark:bg-darkBg-primary dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users size={16} /> User Profiles
          </button>
        </div>
      </div>

      {/* Main Table Records Panel */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-premium dark:border-slate-800 dark:bg-darkBg-secondary overflow-hidden">
        
        {/* Sub Header actions */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
            Manage {activeTab} Records
          </h3>
          <div className="flex gap-2">
            <button
              onClick={fetchTabData}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
            {activeTab === 'menu' && (
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600 shadow-md"
              >
                <Plus size={14} /> Add New Dish
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <RefreshCw className="animate-spin text-primary-500" size={32} />
            <p className="text-xs font-bold uppercase tracking-wider">Syncing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'menu' && (
              /* MENU ITEMS TABLE */
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:bg-darkBg-primary/20 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {foods.map((food) => (
                    <tr key={food._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4">
                        <img
                          src={food.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'}
                          alt={food.name}
                          className="h-10 w-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{food.name}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-darkBg-primary dark:text-slate-400">
                          {food.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{formatInr(food.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
                          food.isAvailable ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                        }`}>
                          {food.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(food)}
                            className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleFoodDelete(food._id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'orders' && (
              /* ORDERS TABLE */
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:bg-darkBg-primary/20 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items Summary</th>
                    <th className="px-6 py-4">Grand Total</th>
                    <th className="px-6 py-4">Order Status</th>
                    <th className="px-6 py-4 text-right">Set Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4 font-mono font-bold text-xs max-w-[120px] truncate">{order._id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                        {order.user ? order.user.name : 'Unknown User'} <br />
                        <span className="text-[10px] text-slate-400 font-medium">{order.user?.email}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {order.items.map((item) => `${item.name} (${item.quantity})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{formatInr(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-950/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 outline-none dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'users' && (
              /* USERS DIRECTORY TABLE */
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:bg-darkBg-primary/20 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role Status</th>
                    <th className="px-6 py-4 text-right">Edit Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{usr.name}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{usr.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                          usr.role === 'admin'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserRole(usr)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                          >
                            Toggle Admin
                          </button>
                          <button
                            onClick={() => handleUserDelete(usr._id)}
                            disabled={usr._id === user?.id}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* --- ADD/EDIT FOOD MODAL OVERLAY --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-darkBg-secondary border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                {modalMode === 'add' ? 'Create Food Item' : 'Modify Food Item'}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form content */}
            <form onSubmit={handleFoodSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Dish Name</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="e.g. Garlic Butter Lobster"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Category</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none dark:border-slate-800 dark:bg-darkBg-primary dark:text-white font-bold"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Sushi">Sushi</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Salad">Salad</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Appetizer">Appetizer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="12.99"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Image URL</label>
                <input
                  type="url"
                  required
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  placeholder="Describe the flavors, ingredients, and style..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none transition focus:border-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>

              {/* Availability checkbox */}
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={foodForm.isAvailable}
                  onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded text-primary-500 accent-primary-500"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Is this dish available for order?</span>
              </label>

              {/* Submit panel */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-600 shadow-md"
                >
                  {modalMode === 'add' ? 'Create Dish' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
