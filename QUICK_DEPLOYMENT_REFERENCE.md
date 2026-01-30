# 🚀 PRODUCTION DEPLOYMENT - QUICK REFERENCE

## URLs

| Service | Development | Production |
|---------|-------------|-----------|
| **Frontend** | `http://localhost:5174` | `https://get-hired-easy.vercel.app` |
| **Backend API** | `http://localhost:8200` | `https://get-hired-easy.onrender.com` |

---

## Environment Variables

### Frontend (.env) ✅ UPDATED
```env
VITE_SERVER_URL=https://get-hired-easy.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=diafth7k8
VITE_LOCATION_API=your-location-api-key
```

### Vercel Dashboard (Set These)
```
VITE_SERVER_URL = https://get-hired-easy.onrender.com
VITE_CLOUDINARY_CLOUD_NAME = diafth7k8
VITE_LOCATION_API = your-location-api-key
```

### Render Backend (Already Set)
```
PORT = 8200
MONGODB_URL = (from Atlas)
SECRET_KEY = (from .env)
CLIENT_URL = (UPDATE to Vercel URL after deployment)
```

---

## Deployment Steps

### 1️⃣ Push Code to GitHub
```bash
cd /path/to/Get-Hired-Easy
git add .
git commit -m "Deploy: Configure production URLs"
git push origin main
```

### 2️⃣ Deploy Backend (Already Done ✅)
- Go to render.com
- Backend `get-hired-easy-backend` is running
- Monitor in logs

### 3️⃣ Deploy Frontend to Vercel
```bash
# Option A: Use Vercel CLI
npm install -g vercel
cd client
vercel --prod

# Option B: Use Vercel Dashboard
# Import GitHub repo → Select client folder → Deploy
```

### 4️⃣ Configure Vercel Environment Variables
- Go to Vercel dashboard
- Project settings → Environment Variables
- Add the 3 variables above
- Redeploy

### 5️⃣ Update Render Backend CORS
- Go to render.com
- Backend service settings
- Update `CLIENT_URL` = your Vercel frontend URL
- Redeploy backend

---

## Testing Checklist

### Frontend Deployment
- [ ] Vercel deployment succeeds
- [ ] Frontend URL loads in browser
- [ ] 3D globe animates
- [ ] Navigation works

### API Connectivity
- [ ] Open DevTools Network tab
- [ ] Try to login
- [ ] Requests go to `https://get-hired-easy.onrender.com`
- [ ] No CORS errors

### Features Test
- [ ] Browse jobs page loads
- [ ] Signup/Login works
- [ ] Can apply for jobs
- [ ] File uploads work
- [ ] Profile updates save

---

## Quick Fixes

### Issue: Blank page after deploy
**Check:** Browser console → Look for errors

### Issue: API calls fail
**Check:** 
- Is backend running? Visit `https://get-hired-easy.onrender.com`
- Is VITE_SERVER_URL correct in Vercel?
- Are there CORS errors?

### Issue: Redirect loops
**Check:** CORS configuration matches both URLs

---

## Important URLs

```
Backend Health:     https://get-hired-easy.onrender.com
Jobs Endpoint:      https://get-hired-easy.onrender.com/api/v1/job/get
Frontend:           https://get-hired-easy.vercel.app
Render Logs:        render.com (select service → logs)
Vercel Logs:        vercel.com (select project → deployments)
```

---

## All Files Ready ✅

- ✅ client/.env → Render backend URL
- ✅ client/src/lib/apiClient.js → Uses env variables
- ✅ client/src/utils/constants.js → Dynamic routes
- ✅ vercel.json → Correct configuration
- ✅ render.yaml → Correct configuration
- ✅ server/package.json → Dependencies fixed
- ✅ server/Dockerfile → Build tools included

---

## Need Help?

### Documentation
- **Vercel Setup:** `VERCEL_DEPLOYMENT_GUIDE.md`
- **URL Migration:** `PRODUCTION_URL_MIGRATION.md`
- **Dependencies:** `PACKAGE_AUDIT_REPORT.md`

### Commands
```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check backend
curl https://get-hired-easy.onrender.com/api/v1/job/get
```

---

**Status:** ✅ READY FOR PRODUCTION
**Date:** January 30, 2026
