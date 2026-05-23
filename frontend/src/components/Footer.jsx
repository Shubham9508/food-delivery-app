import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 text-slate-400 dark:bg-darkBg-secondary dark:text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo Column */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-extrabold tracking-tight text-primary-500">
              Food<span className="text-white">Express</span>
            </span>
            <p className="text-sm leading-relaxed">
              Delivering premium gourmet meals from the city's finest kitchens straight to your doorstep, warm and fresh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Cuisines</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Italian Sourdough Pizza</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Gourmet Angus Burgers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Fresh Sushi Platters</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Traditional Indian Cuisines</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Support</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>Email: support@foodexpress.com</li>
              <li>Phone: +1 (555) 019-2834</li>
              <li>Location: 456 Delivery Lane, Tech City, NY</li>
              <li className="mt-2">
                <span className="inline-flex rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400">
                  Open 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-slate-800 dark:border-slate-800/40" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs">
          <p>© {new Date().getFullYear()} FoodExpress Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
