# Project README — Food Delivery App (Quick Start)

Short summary
- Full-stack app: React frontend (Vite) + Node/Express backend + MongoDB database.

Requirements (what you need on your machine)
- Node.js and npm
- Docker (optional, for running MongoDB locally)

Run backend (development)
- Open a terminal:

```
cd backend
npm install
cp .env.example .env   # or create .env with the variables below
# start in dev mode with auto-reload
npm run dev
```

Environment variables (basic)
- `MONGODB_URI` — MongoDB connection string (e.g. mongodb://localhost:27017/food-app)
- `JWT_SECRET` — secret for signing tokens
- `PORT` — backend port (e.g. 5000)

Run frontend (development)

```
cd frontend
npm install
npm run dev
```

Run MongoDB with Docker (optional)

```
docker run -d --name mongo -p 27017:27017 -v mongodata:/data/db mongo:6.0
```

Seed example data (if you need sample data)

```
cd backend
npm run seed
```

Important files to show in viva
- Backend entry: [backend/server.js](backend/server.js#L1)
- DB config: [backend/config/db.js](backend/config/db.js#L1)
- Models: [backend/models/User.js](backend/models/User.js#L1)
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx#L1)

Notes
- Use `npm start` to run the backend in production mode (it runs `node server.js`).
- For production DB use MongoDB Atlas or a managed service.
