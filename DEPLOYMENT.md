# SparkCircle Deployment Guide

This guide covers deploying SparkCircle to production using Railway or Render.

## Architecture Overview

SparkCircle uses an **in-memory session store** instead of a database, making it:
- ✅ Simpler to deploy (no database setup)
- ✅ Faster response times
- ✅ Cost-effective (no database costs)
- ✅ Perfect for temporary sessions (24-hour expiry)

## Option 1: Deploy to Railway (Recommended)

Railway offers the simplest deployment experience with automatic builds and SSL.

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Deploy Backend**
   - Railway will auto-detect the Node.js app
   - Click on the service card
   - Go to "Settings" tab
   - Set Root Directory to `/backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=3001
     CLIENT_URL=https://your-frontend-url.up.railway.app
     ```

4. **Deploy Frontend**
   - Click "New" → "GitHub Repo" in the same project
   - Select your repository again
   - Set Root Directory to `/frontend`
   - Add build command: `npm install && npm run build`
   - Add environment variable:
     ```
     REACT_APP_SOCKET_URL=https://your-backend-url.up.railway.app
     ```

5. **Configure Domains**
   - Railway provides free `*.up.railway.app` domains
   - Or add your custom domain in Settings → Domains

## Option 2: Deploy to Render

Render offers a free tier and automatic deploys from GitHub.

### Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))

### Automatic Setup (Using render.yaml)

1. **Push code with render.yaml**
   ```bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Create New Blueprint**
   - Go to [render.com](https://render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`
   - Click "Apply"

### Manual Setup

1. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: `sparkcircle-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend.onrender.com
     ```

2. **Deploy Frontend**
   - Click "New" → "Static Site"
   - Connect GitHub repository
   - Configure:
     - Name: `sparkcircle-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`
   - Add environment variable:
     ```
     REACT_APP_SOCKET_URL=https://sparkcircle-backend.onrender.com
     ```

## Option 3: Deploy to Vercel + Railway

Use Vercel for the frontend (better performance) and Railway for the backend.

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variable**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add: `REACT_APP_SOCKET_URL=https://your-backend.up.railway.app`

### Backend on Railway
Follow the Railway backend steps from Option 1.

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-frontend-url.com,https://www.your-frontend-url.com
```

### Frontend (.env)
```env
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

- [ ] Test room creation
- [ ] Test joining rooms
- [ ] Test real-time updates
- [ ] Verify CORS is working
- [ ] Check WebSocket connections
- [ ] Monitor health endpoint: `https://your-backend/api/health`

## Monitoring

The health endpoint provides useful metrics:
```json
GET /api/health

{
  "status": "OK",
  "message": "SparkCircle backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "activeSessions": 5,
  "environment": "production"
}
```

## Troubleshooting

### CORS Issues
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Multiple URLs can be comma-separated
- Include both www and non-www versions if needed

### WebSocket Connection Failed
- Check that the backend URL in frontend env is correct
- Ensure the backend service is running
- Verify WebSocket support is enabled (Railway/Render support it by default)

### Sessions Not Persisting
- Remember: Sessions are stored in memory
- If the backend restarts, all sessions are lost
- This is by design for simplicity
- Consider implementing Redis if you need persistence

## Scaling Considerations

The in-memory store works great for:
- Up to ~1000 concurrent sessions
- Small to medium traffic
- Temporary data that can be lost on restart

If you need to scale beyond this:
1. Add Redis for session storage
2. Use multiple backend instances with sticky sessions
3. Implement database storage (PostgreSQL/MongoDB)

## Cost Estimates

### Railway
- Free tier: 500 hours/month
- Hobby: $5/month (unlimited hours)
- Perfect for: Small to medium apps

### Render
- Free tier: 750 hours/month
- May spin down after 15 min inactivity
- Paid: $7/month (always on)

### Recommended Setup
- Start with free tiers
- Upgrade to paid (~$5-10/month total) when you have regular users
- No database costs since we use in-memory storage!

## Support

For deployment issues:
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Repository Issues: [GitHub Issues](https://github.com/yourusername/sparkcircle/issues)
