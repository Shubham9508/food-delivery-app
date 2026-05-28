# Deployment Notes (Simple)

Frontend (S3 static website)
- Build the frontend:

```
cd frontend
npm install
npm run build
```

- Upload the `dist` or `build` folder to an S3 bucket and enable static website hosting. Set bucket policy for public read or use CloudFront.
- Example quick AWS CLI sync:

```
aws s3 sync dist/ s3://your-bucket-name --delete
```

Backend (EC2 / VPS)
- On the server, install Node.js and pull the project.
- Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).
- Start the backend with a process manager (example PM2):

```
npm install -g pm2
pm2 start server.js --name food-backend
pm2 save
```

Database choices
- Development: run MongoDB with Docker locally:

```
docker run -d --name mongo -p 27017:27017 -v mongodata:/data/db mongo:6.0
```

- Production: use MongoDB Atlas or a managed database for reliability and backups.

Network and security
- Open ports needed: 80/443 for frontend (if using CloudFront), and backend port (e.g., 5000) only if you want direct access. Use security groups or firewalls.
- Configure CORS on the backend to allow the frontend origin.

Useful tips for viva
- Mention that frontend is on S3 and backend on an instance (IP). Say you'd switch database to Atlas and HTTPS in production.
