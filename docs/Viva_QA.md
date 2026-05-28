# Viva Questions & Simple Answers

Use these short answers in plain English. Keep each answer calm and slow.

1) What is this project?
- It is a food delivery app where users can browse food, add to cart, and place orders. The UI is built with React and the API is built with Node/Express.

2) What technologies did you use?
- Frontend: React + Vite. Backend: Node.js + Express. Database: MongoDB with Mongoose. Auth: JWT. Styling: simple CSS.

3) How do you handle authentication?
- Users sign up and log in. Passwords are hashed with `bcrypt`. After login, the server sends a JWT token which the frontend stores and sends with protected API requests.

4) How do you store passwords safely?
- I use `bcrypt` to hash passwords before saving to the database. The plain password is never stored.

5) Are you using Docker?
- I use Docker for MongoDB during local development (easy to start/stop). For the project right now I run MongoDB in Docker locally. In production I would use a managed DB like MongoDB Atlas.

6) Is the app deployed to cloud?
- Yes: frontend is deployed to AWS S3 static website: http://food-delivery-frontend-shubham.s3-website.eu-north-1.amazonaws.com
- The backend runs on an instance at `http://13.60.46.192`.

7) How would you improve the project for production?
- Use HTTPS and a proper domain, move DB to managed service (Atlas), add logging and monitoring, add tests, and use CloudFront or CDN for frontend.

8) What is state management in the frontend?
- I used React Context API to hold auth state and the cart across components (simple and enough for this app).

9) How do frontend and backend communicate?
- They use REST API calls over HTTP (fetch or axios). The frontend calls endpoints like `/api/foods`, `/api/cart`, `/api/orders`.

10) What questions might the examiner ask about errors?
- Be ready to explain CORS, missing env variables, and how to check backend logs. Say: "I check server logs, confirm env vars, and test endpoints with Postman or curl." 
