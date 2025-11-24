# Deployment Guide

## Backend Deployment on Render

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Click "New" → "Web Service"

### Step 2: Connect Your GitHub Repository
1. Select "GitHub" and authorize Render
2. Search for your repository: `Get-Hired-Easy`
3. Connect it

### Step 3: Configure the Service
- **Name**: `get-hired-easy-backend`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && node app.js`
- **Plan**: Free (or paid if needed)

### Step 4: Add Environment Variables
Click "Advanced" and add these environment variables from your `server/.env`:

```
MONGODB_URL=mongodb+srv://rajneeshavneeshkar:1234@cluster0.2i0o1zg.mongodb.net/?appName=Cluster0
SECRET_KEY=your-secret-key
CLIENT_URL=https://get-hired-easy.vercel.app
CLOUD_NAME=dqjnxkxi5
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
PORT=8000
NODE_ENV=production
```

### Step 5: Deploy
Click "Create Web Service" and Render will automatically:
1. Clone your repo
2. Install dependencies
3. Build the project
4. Start the server

Your backend will be live at: `https://get-hired-easy-backend.onrender.com`

---

## Frontend Deployment on Vercel

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "Add New" → "Project"

### Step 2: Import Your Repository
1. Select "GitHub" and authorize
2. Select your `Get-Hired-Easy` repository
3. Click "Import"

### Step 3: Configure Project Settings
- **Framework**: Vite
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`

### Step 4: Add Environment Variables
Add this to your Vercel project settings:

```
VITE_SERVER_URL=https://get-hired-easy-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=dqjnxkxi5
VITE_LOCATION_API=jS6AEeXYjacpdYgosBfKXrlL8bzE3_U5mMOvM2RBSmjulC37JMnm7NpjNR-ybVJk1wI
```

### Step 5: Deploy
Click "Deploy" and Vercel will:
1. Clone your repo
2. Install dependencies
3. Build the frontend
4. Deploy to CDN

Your frontend will be live at: `https://get-hired-easy.vercel.app`

---

## Testing After Deployment

### Test Backend
```bash
curl https://get-hired-easy-backend.onrender.com/api/v1/job/get
```

### Test Frontend
Visit `https://get-hired-easy.vercel.app` in your browser

### Test Login
- **Recruiter**: rajesh@techcorp.com / password123
- **Student**: rohit.sharma@email.com / password123

---

## If You Want to Test Locally First

Update `client/.env` to:
```
VITE_SERVER_URL=http://localhost:8000
```

Then run:
```bash
# Terminal 1 - Start Backend
cd server
npm install
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

