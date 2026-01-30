# 🚀 Deployment Guide - Render & Vercel

## Overview
- **Backend**: Render.com (Node.js/Express)
- **Frontend**: Vercel (React/Vite)
- **Database**: MongoDB Atlas (Cloud)

---

## 📋 Prerequisites

1. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas
2. **Cloudinary Account** - https://cloudinary.com
3. **Gmail App Password** - For email notifications
4. **Render.com Account** - https://render.com
5. **Vercel Account** - https://vercel.com
6. **GitHub Account** - For CI/CD integration

---

## 🔐 Environment Variables Setup

### Backend Environment Variables (Render)

On Render Dashboard, set these environment variables:

```
NODE_ENV=production
PORT=8200
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/Get-hired-Easy
CLIENT_URL=https://your-frontend.vercel.app
SECRET_KEY=your-random-secret-32-chars
CLOUD_NAME=your-cloudinary-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
EMAIL_USER=your-gmail@gmail.com
PASS_USER=your-gmail-app-password
SESSION_SECRET=your-session-secret-32-chars
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

### Frontend Environment Variables (Vercel)

On Vercel Dashboard, set these environment variables:

```
VITE_SERVER_URL=https://your-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
VITE_LOCATION_API=your-location-api-key
```

---

## 📦 Step 1: Prepare Backend for Render

### 1.1 Update package.json
✅ Already updated with `"start": "node app.js"`

### 1.2 Verify .env variables
Make sure your `.env` file has all required variables

### 1.3 Check server/app.js
Ensure it uses environment variables correctly

### 1.4 Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Login to Render.com
https://dashboard.render.com

### 2.2 Create New Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the branch (main/master)

### 2.3 Configure Service
- **Name**: `get-hired-easy-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `server`

### 2.4 Add Environment Variables
Copy from render.yaml and add values:
- MONGODB_URL
- SECRET_KEY
- CLOUD_NAME
- API_KEY
- API_SECRET
- EMAIL_USER
- PASS_USER
- SESSION_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- CLIENT_URL=`https://your-vercel-app.vercel.app`

### 2.5 Deploy
Click "Create Web Service"

**Backend URL**: `https://get-hired-easy-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Login to Vercel
https://vercel.com

### 3.2 Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Select "Continue"

### 3.3 Configure Project
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `client`

### 3.4 Add Environment Variables
In "Environment Variables" section, add:

```
VITE_SERVER_URL=https://get-hired-easy-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
VITE_LOCATION_API=your-api-key
```

### 3.5 Deploy
Click "Deploy"

**Frontend URL**: `https://your-project.vercel.app`

---

## 📝 Post-Deployment Checklist

- [ ] Backend accessible at Render URL
- [ ] Frontend accessible at Vercel URL
- [ ] Update `CLIENT_URL` in Render with actual Vercel URL
- [ ] Update `VITE_SERVER_URL` in Vercel with actual Render URL
- [ ] Test signup functionality
- [ ] Test login functionality
- [ ] Test file upload (Cloudinary)
- [ ] Test email notifications
- [ ] Check console logs on both platforms
- [ ] Monitor error logs

---

## 🔄 Redeployment

### Automatic Redeploy
Both Render and Vercel redeploy automatically on every push to main branch.

### Manual Redeploy

**Render**:
1. Dashboard → Select your service
2. Click "Manual Deploy"
3. Select branch

**Vercel**:
1. Dashboard → Select your project
2. Click the latest deployment
3. Click "Redeploy"

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs on Render
1. Go to Render Dashboard
2. Select your service
3. View "Logs" tab
4. Look for error messages
```

### CORS Error
1. Verify `CLIENT_URL` in Render matches frontend URL
2. Restart Render service
3. Clear browser cache

### Frontend Can't Connect to Backend
1. Check `VITE_SERVER_URL` in Vercel
2. Ensure Render backend is running
3. Test API endpoint directly in browser

### Database Connection Failed
1. Verify `MONGODB_URL` is correct
2. Check MongoDB Atlas IP whitelist includes all IPs (or use 0.0.0.0)
3. Ensure database user has correct permissions

### File Upload Not Working
1. Verify Cloudinary credentials
2. Check API_SECRET is correct
3. Ensure file size is under limits

---

## 📊 Monitoring & Logs

### View Backend Logs (Render)
```
Render Dashboard → Service → Logs
```

### View Frontend Logs (Vercel)
```
Vercel Dashboard → Project → Deployments → Select Deployment → Logs
```

### Monitor Database (MongoDB Atlas)
```
MongoDB Atlas → Cluster → Activity
```

---

## 🔒 Security Notes

1. **Never commit .env files** to GitHub
2. **Use environment variables** for all secrets
3. **Enable IP whitelist** on MongoDB Atlas
4. **Use strong passwords** for all accounts
5. **Rotate credentials regularly**
6. **Monitor logs** for suspicious activity

---

## 💾 Database Backup

### MongoDB Atlas Backup
1. Cluster → Backup → Create Snapshot
2. Select frequency (hourly/daily)
3. Automated backups enabled by default

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8200 already in use | Change PORT in environment variables |
| Cannot find module | Run `npm install` in correct directory |
| CORS blocked | Update CLIENT_URL in backend |
| Database timeout | Check internet connection, IP whitelist |
| Build failed | Check build logs, run locally first |

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com

---

## ✅ Deployment Complete!

Your application is now deployed and accessible globally:

- **Frontend**: https://your-project.vercel.app
- **Backend API**: https://get-hired-easy-backend.onrender.com/api/v1

Users can now sign up, login, browse jobs, and apply for positions! 🎉
