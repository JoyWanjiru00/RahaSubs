# RahaSubs Deployment Guide

This guide will walk you through deploying RahaSubs to production using Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier available)

## 🗄️ Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "RahaSubs")
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set user privileges to "Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/rahasubs?retryWrites=true&w=majority`

## 🐙 Step 2: GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Navigate to your project
   cd /workspace/shadcn-ui
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - RahaSubs subscription sharing platform"
   
   # Create a new repository on GitHub.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/rahasubs.git
   git branch -M main
   git push -u origin main
   ```

2. **Verify Upload**
   - Go to your GitHub repository
   - Ensure all files are uploaded
   - Check that `.env` is NOT uploaded (it should be in `.gitignore`)

## 🚀 Step 3: Deploy Backend to Render

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created

3. **Configure Service**
   - **Name**: `rahasubs-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | A random secure string (e.g., `rahasubs-jwt-secret-2024-production-key`) |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://rahasubs-backend.onrender.com`)

6. **Test Backend**
   - Visit `https://your-backend-url.onrender.com/api/health`
   - You should see: `{"status":"ok","message":"RahaSubs API is running"}`

## 🌐 Step 4: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm run build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (or `npm install`)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | Your Render backend URL + `/api` (e.g., `https://rahasubs-backend.onrender.com/api`) |
   | `VITE_USE_MOCK_API` | `false` |

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Copy your frontend URL (e.g., `https://rahasubs.vercel.app`)

## 🔄 Step 5: Update Backend CORS

1. **Update Render Environment Variables**
   - Go back to your Render dashboard
   - Select your backend service
   - Go to "Environment"
   - Add new environment variable:
     - **Key**: `FRONTEND_URL`
     - **Value**: Your Vercel URL (e.g., `https://rahasubs.vercel.app`)
   - Click "Save Changes"
   - Service will automatically redeploy

## 🌱 Step 6: Seed Database (Optional)

Populate your database with initial subscription templates:

```bash
# From your local machine
cd /workspace/shadcn-ui/server

# Set environment variable temporarily
export MONGODB_URI="your-mongodb-atlas-connection-string"

# Run seed script
npm run seed
```

Or create a seed script on Render:
1. Go to your Render service
2. Click "Shell" tab
3. Run: `node seed.js`

## ✅ Step 7: Test Your Deployment

1. **Visit Your Frontend**
   - Go to your Vercel URL
   - You should see the RahaSubs landing page

2. **Test Registration**
   - Click "Get Started"
   - Create a new account
   - Verify you can register successfully

3. **Test Login**
   - Log in with your new account
   - Check that you're redirected to the dashboard

4. **Test Wallet**
   - Add funds to your wallet
   - Verify balance updates

5. **Test Subscriptions**
   - Browse available subscriptions
   - Join a group
   - Make a payment
   - Verify payment reflects in dashboard

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend health check fails
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

**Problem**: CORS errors
- Verify `FRONTEND_URL` is set in Render
- Check that your Vercel URL matches exactly
- Try adding both `https://your-app.vercel.app` and `https://*.vercel.app`

### Frontend Issues

**Problem**: API calls fail
- Check `VITE_API_URL` is correct in Vercel
- Ensure it ends with `/api`
- Verify `VITE_USE_MOCK_API` is set to `false`

**Problem**: Build fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Try deploying with `npm` instead of `pnpm`

### Database Issues

**Problem**: Cannot connect to MongoDB
- Verify IP whitelist includes `0.0.0.0/0`
- Check username and password in connection string
- Ensure database name is included in URI

## 🔄 Continuous Deployment

Both Vercel and Render are configured for automatic deployments:

- **Push to GitHub** → Automatic deployment to both services
- **Frontend**: Vercel rebuilds on every push to `main`
- **Backend**: Render redeploys on every push to `main`

## 📊 Monitoring

### Vercel
- Go to your project dashboard
- View deployment logs, analytics, and performance

### Render
- Go to your service dashboard
- View logs, metrics, and health status

### MongoDB Atlas
- Monitor database performance
- View connection statistics
- Set up alerts for issues

## 🎉 You're Done!

Your RahaSubs application is now live in production!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas

## 📝 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update `FRONTEND_URL` in Render

2. **Monitoring & Alerts**
   - Set up error tracking (e.g., Sentry)
   - Configure uptime monitoring

3. **Backup Strategy**
   - Set up MongoDB Atlas backups
   - Export data regularly

4. **Security Enhancements**
   - Enable 2FA on all accounts
   - Rotate JWT secret regularly
   - Review security best practices

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs (Vercel, Render, MongoDB Atlas)
3. Verify all environment variables are correct
4. Ensure your free tier limits aren't exceeded

---

**Congratulations on deploying RahaSubs! 🎊**