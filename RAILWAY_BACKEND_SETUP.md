# Railway Backend-Only Deployment Guide

This guide covers deploying only the SparkCircle backend to Railway while your frontend is hosted on Vercel.

## Prerequisites
- Frontend already deployed on Vercel
- GitHub repository with the SparkCircle code
- Railway account ([railway.app](https://railway.app))

## Step 1: Prepare Your Repository

Make sure your backend has its own `railway.json` configuration file in the `backend` folder (already created).

## Step 2: Deploy Backend to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Click "New Project"

2. **Select "Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub
   - Select your SparkCircle repository

3. **Configure the Service**
   - Railway will create a new service
   - Click on the service card to open settings

4. **Set the Root Directory**
   - Go to the "Settings" tab
   - Scroll to "Root Directory"
   - Set it to: `backend`
   - This tells Railway to only deploy the backend folder

5. **Configure Environment Variables**
   - Go to the "Variables" tab
   - Add the following:
   ```
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-app.vercel.app,https://your-custom-domain.com
   ```
   
   **Important:** For `CLIENT_URL`, include:
   - Your Vercel deployment URL (e.g., `https://sparkcircle.vercel.app`)
   - Your custom domain if you have one
   - Separate multiple URLs with commas (no spaces)

### Option B: Deploy from CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project in Backend Directory**
   ```bash
   cd backend
   railway init
   ```

4. **Link to Existing Project (if you have one)**
   ```bash
   railway link
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set CLIENT_URL=https://your-app.vercel.app
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Step 3: Get Your Backend URL

1. After deployment, go to your Railway project
2. Click on the service
3. Go to "Settings" tab
4. Scroll to "Domains"
5. Click "Generate Domain" to get a `*.up.railway.app` URL
6. Or add a custom domain

Your backend URL will be something like:
- `https://sparkcircle-backend.up.railway.app`

## Step 4: Update Vercel Frontend

1. **Go to Vercel Dashboard**
   - Select your SparkCircle frontend project
   - Go to "Settings" → "Environment Variables"

2. **Add/Update the Backend URL**
   ```
   REACT_APP_SOCKET_URL=https://your-backend.up.railway.app
   ```
   Replace with your actual Railway backend URL

3. **Redeploy Frontend**
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

## Step 5: Verify Everything Works

1. **Check Backend Health**
   ```
   curl https://your-backend.up.railway.app/api/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "message": "SparkCircle backend is running",
     "timestamp": "...",
     "activeSessions": 0,
     "environment": "production"
   }
   ```

2. **Test the Frontend**
   - Visit your Vercel frontend URL
   - Create a room
   - Join from another browser/device
   - Verify real-time updates work

## Environment Variables Reference

### Backend (Railway)
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://sparkcircle.vercel.app,https://www.yourdomain.com
```

### Frontend (Vercel)
```env
REACT_APP_SOCKET_URL=https://sparkcircle-backend.up.railway.app
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:

1. **Check CLIENT_URL in Railway**
   - Must match your Vercel URL exactly
   - Include both www and non-www if using custom domain
   - No trailing slashes
   - Comma-separated, no spaces

2. **Example for multiple domains:**
   ```
   CLIENT_URL=https://sparkcircle.vercel.app,https://sparkcircle-git-main.vercel.app,https://sparkcircle.com,https://www.sparkcircle.com
   ```

### WebSocket Connection Failed
1. Ensure Railway backend is running (check logs)
2. Verify `REACT_APP_SOCKET_URL` in Vercel matches Railway URL
3. Check Railway logs for any errors

### "Deploy failed" in Railway
1. Check build logs in Railway dashboard
2. Ensure `backend` folder is set as root directory
3. Verify `package.json` exists in backend folder

## Monitoring

### Railway Logs
- Click on your service in Railway
- Go to "Deployments" tab
- Click on a deployment to see logs

### Useful Commands
```bash
# View logs from CLI
railway logs

# Check service status
railway status

# Restart service
railway restart
```

## Cost Optimization

### Railway (Backend)
- **Hobby Plan**: $5/month for unlimited usage
- **Usage-based**: Pay only for what you use
- **Free tier**: 500 hours/month (enough for testing)

### Tips to Reduce Costs
1. Use Railway's sleep feature for staging environments
2. Monitor usage in Railway dashboard
3. The in-memory store means no database costs!

## Next Steps

1. **Set up monitoring** (optional)
   - Add error tracking (Sentry)
   - Set up uptime monitoring (UptimeRobot)

2. **Configure custom domain** (optional)
   - Add custom domain in Railway settings
   - Update CORS settings with new domain

3. **Enable auto-deploy**
   - Railway auto-deploys on push to main branch
   - Set up branch deploys for staging

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
