# Frontend Vercel Deployment Guide with Render Backend

## Current Configuration

### Production Backend URL
```
https://get-hired-easy.onrender.com
```

### Production Frontend URL (After Vercel Deployment)
```
https://get-hired-easy.vercel.app  (or your custom domain)
```

---

## Environment Configuration

### Local Development (.env)
```env
VITE_SERVER_URL=https://get-hired-easy.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=diafth7k8
VITE_LOCATION_API=your-location-api-key
```

**Status:** ✅ Updated to production Render URL

### Vercel Deployment (Environment Variables)
When deploying to Vercel, you need to set these environment variables in the Vercel dashboard.

---

## Step-by-Step Deployment to Vercel

### Step 1: Prepare Code for Deployment

```bash
cd client
npm install
npm run build
```

✅ Verify build succeeds without errors

### Step 2: Push to GitHub

```bash
cd ..
git add .
git commit -m "Deploy: Update backend URL to Render, prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if not already
npm install -g vercel

# Deploy from project root
cd client
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

### Step 4: Add Environment Variables in Vercel Dashboard

After initial deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value |
|---|---|
| `VITE_SERVER_URL` | `https://get-hired-easy.onrender.com` |
| `VITE_CLOUDINARY_CLOUD_NAME` | `diafth7k8` |
| `VITE_LOCATION_API` | `your-actual-api-key` |

4. Redeploy after adding env vars:
   - Go to **Deployments** tab
   - Click the latest deployment
   - Click "Redeploy"

---

## Verification Checklist

### ✅ Local Testing Before Deployment

```bash
cd client
npm install
npm run build
npm run preview
```

Test these features:
- [ ] Homepage loads
- [ ] 3D Globe animates
- [ ] Navbar navigation works
- [ ] Login page appears
- [ ] Signup can be attempted (should connect to Render)

### ✅ After Vercel Deployment

1. **Frontend URL Works:**
   ```
   https://your-vercel-app.vercel.app
   ```
   - [ ] Site loads completely
   - [ ] No blank pages
   - [ ] 3D globe renders

2. **API Connectivity Test:**
   ```
   Open browser DevTools → Network tab
   Try to login/signup
   Should see requests to: https://get-hired-easy.onrender.com/api/v1/...
   ```

3. **Features to Test:**
   - [ ] Browse Jobs page loads jobs
   - [ ] View Job Details shows complete info
   - [ ] Apply for Job button works
   - [ ] Login/Signup redirects correct
   - [ ] File uploads for profile picture work
   - [ ] Search/Filter jobs functions

---

## CORS Configuration Verification

### Backend (Render) Already Configured:
```javascript
// server/app.js
cors({
  origin: "https://your-vercel-app.vercel.app",
  credentials: true
})
```

**Status:** ✅ Need to update CLIENT_URL in Render env vars after Vercel deployment

### Frontend (.env) Already Configured:
```javascript
// client/src/lib/apiClient.js
axios.create({
  baseURL: "https://get-hired-easy.onrender.com",
  withCredentials: true
})
```

**Status:** ✅ Already using Render URL

---

## Important: Update Render Backend After Vercel Deployment

Once you have your Vercel frontend URL (e.g., `https://your-app-name.vercel.app`):

1. Go to Render Dashboard
2. Select your backend service (get-hired-easy-backend)
3. Go to **Settings**
4. Update Environment Variable:
   ```
   CLIENT_URL = https://your-vercel-app-name.vercel.app
   ```
5. Click "Save"
6. Service will auto-redeploy with new CORS settings

This ensures both frontend and backend can communicate securely.

---

## File Structure & Configuration

### Frontend Configuration Files Updated:
- ✅ `client/.env` - VITE_SERVER_URL updated to Render URL
- ✅ `client/src/lib/apiClient.js` - Uses VITE_SERVER_URL
- ✅ `client/src/utils/constants.js` - All routes use HOST variable
- ✅ `vercel.json` - Configured for Vite SPA

### All API Calls Use:
```javascript
// Example from any component
import { apiClient } from "@/lib/apiClient";

const res = await apiClient.get("/api/v1/job/get");
// Becomes: https://get-hired-easy.onrender.com/api/v1/job/get
```

---

## Debugging Tips

### Issue: Frontend shows "Cannot reach backend"

**Check:**
1. Is Render backend running? 
   - Visit `https://get-hired-easy.onrender.com` in browser
   - Should show the Node.js error page or redirect

2. Is VITE_SERVER_URL correct in Vercel?
   - Check Vercel dashboard → Environment Variables
   - Verify it's `https://get-hired-easy.onrender.com`

3. Check Browser Console:
   - Open DevTools → Console
   - Look for CORS errors
   - Should show requests to `https://get-hired-easy.onrender.com`

### Issue: CORS errors

**Solution:**
1. Check Render backend logs
2. Verify CLIENT_URL env var matches your Vercel URL
3. Restart Render service

### Issue: Login/Signup fails silently

**Check:**
1. Network tab in DevTools
2. Verify request goes to Render backend
3. Check Render backend logs for errors
4. Verify MongoDB connection works

---

## Production URLs Summary

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://get-hired-easy.vercel.app` | User-facing website |
| Backend | `https://get-hired-easy.onrender.com` | API server |
| Database | MongoDB Atlas Cloud | Data storage |

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub (main branch)
- [ ] `client/.env` has VITE_SERVER_URL = Render backend URL
- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables added in Vercel dashboard
- [ ] Build succeeds in Vercel (check Deployments)
- [ ] Frontend URL accessible in browser
- [ ] 3D globe renders without errors
- [ ] Test login (should connect to Render)
- [ ] Render backend CLIENT_URL updated with Vercel URL
- [ ] Test signup/job apply (full integration)

---

## Support URLs

### Check Render Backend Status:
```
https://get-hired-easy.onrender.com/api/v1/job/get
```
Should return JSON data (even if empty array)

### Check Vercel Frontend Status:
```
https://get-hired-easy.vercel.app
```
Should load the website normally

### Render Logs:
- Go to render.com
- Select your service
- View logs in real-time

### Vercel Logs:
- Go to vercel.com
- Select your project
- View build and runtime logs

---

**Configuration Date:** January 30, 2026
**Status:** ✅ Ready for Vercel Deployment
**Backend URL:** https://get-hired-easy.onrender.com
**Frontend URL:** Ready (pending Vercel deployment)
