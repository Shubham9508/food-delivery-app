# Viva Prep — Food Delivery App (Simple English)

This page will help you explain the project in plain English during viva.

Overview
- This is a simple food delivery app with a React frontend and a Node/Express backend.
- The app stores data in MongoDB (we use Mongoose in the backend).
- Frontend is deployed to AWS S3 (static website). Backend runs on a server (your IP: 13.60.46.192).

How things connect (very simple)
- The user opens the frontend website in browser.
- Frontend calls backend API endpoints (HTTP) to get foods, add to cart, place orders.
- Backend talks to MongoDB to save users, carts, orders, and food items.

Main parts you should mention
- Frontend: React + Vite, components in `src/components`, pages in `src/pages`.
- Backend: Node.js + Express, routes in `backend/routes`, controllers in `backend/controllers`.
- Database: MongoDB (local or Docker); Mongoose models in `backend/models`.
- Auth: JWT tokens for protected routes; passwords hashed with bcrypt.

Docker note (what to say in viva)
- Right now you can run MongoDB in Docker. Say: "I use Docker for MongoDB locally during development." 
- Simple Docker command to run MongoDB:

```
docker run -d --name mongo -p 27017:27017 -v mongodata:/data/db mongo:6.0
```

- Connection string then is `mongodb://localhost:27017/your-db-name` (set in backend `.env`).

Cloud and deployment (simple lines to say)
- Frontend deployed to S3 static website: http://food-delivery-frontend-shubham.s3-website.eu-north-1.amazonaws.com
- Backend hosted on your server at `http://13.60.46.192` (give full URL to endpoints).
- In production you might use MongoDB Atlas (managed DB) instead of local Docker.

Files to point at during viva
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx#L1)
- Backend entry: [backend/server.js](backend/server.js#L1)
- Database config: [backend/config/db.js](backend/config/db.js#L1)

Practice lines (say these simply)
- "This project is a full-stack app: React on the front, Express on the back, MongoDB as the database."
- "I used JWT for authentication and Context API in React for simple global state (cart & auth)."
- "I deployed the frontend on AWS S3 and the backend runs on an EC2 instance (IP shown)."

Good luck — explain slowly and use these short lines.
