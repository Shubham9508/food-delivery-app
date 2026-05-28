# FoodExpress - Full-Stack Food Delivery Application

A modern, production-ready full-stack food delivery application built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. The app features a premium user interface with user authentication, database-synced cart operations, interactive visual order status trackers, and an administrative dashboard panel.

---

## Key Features

- 🌟 **Premium UI/UX**: Dynamic design with glassmorphism, smooth animations, and curated HSL color palettes.
- 🌓 **Dark & Light Mode**: Instantly responsive system-default or manually toggled theme state.
- 🍽️ **Cuisine Categories**: Fluid horizontal scroller supporting live filtering (Pizza, Burger, Sushi, Desserts, etc.).
- 🔍 **Live Search**: Debounced client-to-server query filter for food dishes.
- 🛒 **Persistent Shopping Basket**: DB-backed cart for logged-in accounts, with seamless fallback to browser `localStorage` for anonymous guests.
- 📈 **Interactive Order Tracker**: Beautiful multi-step tracking progress bar (`Placed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- 🔑 **Secure Authentication**: JWT-based authorization utilizing password hashing (`bcryptjs`) on signup and logins.
- 🛠️ **Full Admin Control Panel**:
  - **Menu Management**: Full CRUD interface (Add/Edit/Delete food items via modal overlay forms).
  - **Order Tracker**: Update delivery status of user orders.
  - **User Directory**: List registered users, delete accounts, or change permissions.

---

## Folder Structure

```
food-delivery-app/
├── backend/
│   ├── config/             # DB connectivity
│   ├── controllers/        # Express handlers (auth, food, cart, order, admin)
│   ├── middleware/         # Security checks (auth, admin, error-handling)
│   ├── models/             # Mongoose Schemas (User, Food, Cart, Order)
│   ├── routes/             # REST routing modules
│   ├── seed.js             # Initial database population script
│   ├── server.js           # Server startup script
│   └── .env                # Secret configurations
└── frontend/
    ├── public/             # Static files
    ├── src/
    │   ├── assets/         # Styles, logos
    │   ├── components/     # Reusable modules (Navbar, Footer, FoodCard, CartSidebar)
    │   ├── context/        # React context (Auth, Cart states)
    │   ├── pages/          # Full page views (Home, Login, Register, Checkout, Orders, Profile, Admin)
    │   ├── services/       # Axios API client
    │   ├── App.jsx         # Routes mapping
    │   ├── main.jsx        # Root initiator
    │   └── index.css       # Core styles & Tailwind directives
    ├── index.html          # HTML Entrypoint
    └── tailwind.config.js  # Styling settings
```

---

## Prerequisites

- **Node.js** (v16+ recommended)
- **MongoDB** (local server running on port `27017` or a MongoDB Atlas URI string)

---

## Installation & Setup

Follow these steps to run the application locally.

### 1. Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend/` root directory and add the following keys:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=supersecretfooddeliveryjwtkey12345
   NODE_ENV=development
   ```
4. Seed the Database:
   Populate the database with sample gourmet foods and demo accounts:
   ```bash
   npm run seed
   ```
5. Run the Server:
   ```bash
   npm run dev
   ```
   The backend API will boot up on `http://localhost:5000`.

### 2. Set Up Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Development Client:
   ```bash
   npm run dev
   ```
   Open your browser at the address shown in your terminal (typically `http://localhost:5173`).

---

## Demo Credentials

Execute `npm run seed` first to set up the following accounts:

### Customer Account
- **Email:** `user@fooddelivery.com`
- **Password:** `user123`

### Admin Account
- **Email:** `admin@fooddelivery.com`
- **Password:** `admin123`

---

## Demo Guide
For a step-by-step teacher demo script, see `docs/DEMO.md`.
