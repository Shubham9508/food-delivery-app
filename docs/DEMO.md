# FoodExpress Demo Guide

This document is designed as a teacher-facing demo script for the FoodExpress application. It explains how to run the app, which features to demonstrate, and the exact user accounts to use.

## Objective
Showcase the full-stack flow of a food delivery app:
- User registration and login
- Menu browsing, search, and category filtering
- Cart management and checkout
- Order placement and status tracking
- Profile management
- Admin dashboard with food and order management

---

## 1. Setup and Run the App

### Backend
1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=supersecretfooddeliveryjwtkey12345
   NODE_ENV=development
   ```
4. Seed the database with sample demo data:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
6. The API should be available at `http://localhost:5000`

### Frontend
1. Open a second terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
4. Open the app in the browser using the URL shown in the terminal (usually `http://localhost:5173`).

---

## 2. Demo Credentials
Use the seeded demo accounts to show the app quickly.

### Customer Account
- Email: `user@fooddelivery.com`
- Password: `user123`

### Admin Account
- Email: `admin@fooddelivery.com`
- Password: `admin123`

---

## 3. Demo Flow

### A. Show the Landing/Home Page
- Highlight the premium UI styling and responsive layout.
- Show the food category filters.
- Use the search box to filter by dish name or description.
- Explain live debounce search and backend query handling.

### B. Show Login / Registration
- Use the sample customer account to sign in.
- Optionally show the registration page and explain the signup flow.

### C. Add Food Items to Cart
- Add at least two items to the cart from different categories.
- Open the cart sidebar and show quantity adjustments.
- Explain how the cart state is saved for the current user.

### D. Checkout and Order Placement
- Complete checkout with test details (address, phone, payment method).
- Submit the order and show the success flow.

### E. View Orders and Order Tracking
- Visit the `Orders` page.
- Point out the multi-step progress tracker:
  - `Placed`
  - `Preparing`
  - `Out for Delivery`
  - `Delivered`
- Explain how order status is stored and displayed.

### F. Update User Profile
- Show the `Profile` page.
- Update the phone number or delivery address.
- Explain the backend profile update route.

### G. Show Admin Dashboard
- Log out and log in as the admin account.
- Visit `/admin`.
- Demonstrate admin actions:
  - Add a new food item.
  - Edit an existing food item.
  - Delete a food item.
  - Manage or update order status.

---

## 4. Important Code Paths to Mention

### Frontend
- `frontend/src/pages/Home.jsx` — Food listing, search filtering, category filtering, and mock fallback data.
- `frontend/src/components/CartSidebar.jsx` — Cart view and quantity update logic.
- `frontend/src/pages/Checkout.jsx` — Order submission flow.
- `frontend/src/pages/Orders.jsx` — Order history and progress tracker.
- `frontend/src/pages/Admin.jsx` — Admin management interface.
- `frontend/src/context/AuthContext.jsx` — JWT authentication and user session management.

### Backend
- `backend/seed.js` — Demo data and seeded sample accounts.
- `backend/controllers/authController.js` — Login/register/profile APIs.
- `backend/controllers/foodController.js` — Food CRUD operations.
- `backend/controllers/orderController.js` — Place orders and track status.
- `backend/middleware/auth.js` — Protect routes and enforce admin access.

---

## 5. Demo Talking Points

- This app is built with **React + Vite** on the frontend and **Express + MongoDB** on the backend.
- The authentication system uses **JWT tokens** with secure hashed passwords.
- The cart and order flows are **database-backed**, making the app real and stateful.
- The admin panel demonstrates **full CRUD** capabilities and role-based access.
- The UI supports **dark mode** and responsive mobile navigation.

---

## 6. Optional Teacher Demo Script
1. Open the home page.
2. Log in as `user@fooddelivery.com`.
3. Search for `Pizza` and add two menu items to the cart.
4. Checkout the order.
5. Go to `Orders` and show the status tracker.
6. Log out and log in as `admin@fooddelivery.com`.
7. Add a new menu item and change the status of the most recent order.
8. Return to the customer view and refresh the orders page.

---

## 7. Notes
- The backend currently uses **MongoDB** with `mongoose`.
- The seeded demo accounts are created automatically by `backend/seed.js`.
- If you are showing the app offline, use the seeded credentials and do not need to register a new account.
