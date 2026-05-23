import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sun, Moon, User, LogOut, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Load theme preference on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setDarkMode(false);
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-darkBg-primary/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-primary-500 hover:opacity-90">
              Food<span className="text-slate-800 dark:text-white">Express</span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-darkBg-primary">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Controls */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-3 text-sm font-medium hover:bg-slate-100 dark:border-slate-800 dark:bg-darkBg-secondary dark:hover:bg-slate-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-darkBg-secondary">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white hover:bg-primary-600 hover:shadow-premium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleTheme} className="rounded-full p-2 text-slate-500 dark:text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setCartOpen(true)} className="relative rounded-full p-2 text-slate-500 dark:text-slate-400">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-slate-500 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-darkBg-secondary md:hidden">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{user.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-500 dark:text-slate-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} /> Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-500 dark:text-slate-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag size={18} /> Order History
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium text-rose-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={18} /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border-t border-slate-100 pt-3 text-left text-sm font-medium text-red-500 dark:border-slate-800"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="flex justify-center rounded-full border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex justify-center rounded-full bg-primary-500 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
