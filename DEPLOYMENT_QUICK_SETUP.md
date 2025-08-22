# SparkCircle Quick Deployment Setup

Your deployment URLs:
- **Frontend (Vercel)**: `sparkcircle-a22z2pshe-javier-riveros-projects.vercel.app`
- **Backend (Railway)**: `sparkcircle-backend-production.up.railway.app`

## 🚀 Quick Setup Instructions

### Step 1: Configure Railway Backend

1. **Go to your Railway project**: [railway.app/dashboard](https://railway.app/dashboard)
2. Click on your `sparkcircle-backend` service
3. Go to **Variables** tab
4. Add these environment variables:

```bash
NODE_ENV=production
PORT=3001
CLIENT_URL=https://sparkcircle-a22z2pshe-javier-riveros-projects.vercel.app,https://sparkcircle.vercel.app
```

> **Note**: The CLIENT_URL includes both your current Vercel URL and the shorter alias in case Vercel provides one.

5. Go to **Settings** tab
6. Make sure **Root Directory** is set to: `backend`
7. Railway should auto-deploy after adding variables

### Step 2: Configure Vercel Frontend

1. **Go to your Vercel project**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your SparkCircle project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```bash
REACT_APP_SOCKET_URL=https://sparkcircle-backend-production.up.railway.app
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots (⋮) on the latest deployment
8. Select **Redeploy** → **Redeploy**

### Step 3: Verify Everything Works

1. **Test Backend Health**:
   Open this URL in your browser:
   ```
   https://sparkcircle-backend-production.up.railway.app/api/health
   ```
   
   You should see:
   ```json
   {
     "status": "OK",
     "message": "SparkCircle backend is running",
     "environment": "production"
   }
   ```

2. **Test Frontend**:
   - Visit: `https://sparkcircle-a22z2pshe-javier-riveros-projects.vercel.app`
   - Create a room
   - Copy the room code
   - Open in another browser/incognito
   - Join with the room code
   - Verify real-time updates work

## 🔧 Troubleshooting

### If you see CORS errors:

1. **In Railway**, make sure CLIENT_URL includes your exact Vercel URL:
   ```
   CLIENT_URL=https://sparkcircle-a22z2pshe-javier-riveros-projects.vercel.app
   ```

2. **Add additional Vercel preview URLs if needed**:
   ```
   CLIENT_URL=https://sparkcircle-a22z2pshe-javier-riveros-projects.vercel.app,https://sparkcircle-*.vercel.app,https://sparkcircle.vercel.app
   ```

### If WebSocket connection fails:

1. Check Railway logs for errors
2. Verify the backend URL in Vercel is exactly:
   ```
   https://sparkcircle-backend-production.up.railway.app
   ```
   (no trailing slash!)

### If Railway shows "Deploy failed":

1. Make sure Root Directory is set to `backend`
2. Check build logs for specific errors
3. Verify all npm packages are in `backend/package.json`

## 📊 Monitor Your Deployment

### Railway Backend Logs:
```bash
https://railway.app/project/[your-project-id]/service/[service-id]
```

### Vercel Frontend Logs:
```bash
https://vercel.com/[your-username]/sparkcircle/functions
```

## ✅ Deployment Checklist

- [ ] Railway backend is running (check /api/health)
- [ ] Vercel frontend loads without errors
- [ ] Can create a room
- [ ] Can join a room
- [ ] Real-time updates work (test with 2 browsers)
- [ ] No CORS errors in browser console
- [ ] WebSocket connects successfully

## 🎉 Success!

Your SparkCircle app is now deployed with:
- **Frontend**: Fast CDN delivery via Vercel
- **Backend**: Always-on WebSocket support via Railway
- **No database costs**: Using in-memory storage
- **Total cost**: ~$5/month (Railway Hobby plan)

## Need Help?

- **Railway Support**: [discord.gg/railway](https://discord.gg/railway)
- **Vercel Support**: [vercel.com/help](https://vercel.com/help)
- **Check Logs**: Both Railway and Vercel provide detailed deployment logs
