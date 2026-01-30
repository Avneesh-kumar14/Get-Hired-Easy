# 🚀 Get-Hired-Easy Project - Complete Setup & Debugging Guide

## ✅ Current Status

**Backend**: Running on `http://localhost:8200` ✓  
**Frontend**: Running on `http://localhost:5174` ✓  
**Database**: MongoDB Atlas Connected ✓

---

## 🔧 Issues Resolved

### 1. **CORS (Cross-Origin Resource Sharing) Mismatch**
**Problem**: Frontend was running on port `5173` (default), but `.env` had `CLIENT_URL=http://localhost:5173`  
**Root Cause**: Vite tried port `5174` when `5173` was in use, but CORS wasn't updated  
**Solution**:
- Updated [server/.env](server/.env) to `CLIENT_URL=http://localhost:5174`
- Updated [client/vite.config.js](client/vite.config.js) to force `port: 5174`

### 2. **Null File in FormData**
**Problem**: Frontend was appending `null` file to FormData even when no file was selected  
**Root Cause**: `handleSubmit` in [client/src/pages/Signup.jsx](client/src/pages/Signup.jsx) didn't skip null values  
**Solution**: Added check to skip null file before appending to FormData

### 3. **Content-Type Header**
**Problem**: Manually setting `Content-Type: multipart/form-data` header conflicts with browser auto-detection  
**Solution**: Removed manual header - axios handles it automatically with FormData

---

## 📋 Environment Variables

### Backend ([server/.env](server/.env))
```
PORT=8200
MONGODB_URL=mongodb+srv://rajneeshavneeshkar:1234@cluster0.2i0o1zg.mongodb.net/Get-hired-Easy?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5174
SECRET_KEY=makeityourown
CLOUD_NAME=diafth7k8
API_KEY=729789199238541
API_SECRET=EU0ZFcGy8RP461xscvJRAyduagM
EMAIL_USER=kumarajneesh008@gmail.com
PASS_USER=fack hjhr jhts hwoa
SESSION_SECRET=your-session-secret-key-min-32-chars
```

### Frontend ([client/.env](client/.env))
```
VITE_SERVER_URL=http://localhost:8200
VITE_CLOUDINARY_CLOUD_NAME=diafth7k8
VITE_LOCATION_API=your-location-api-key
```

---

## 📁 Project Architecture

### **Backend Stack** (Node.js/Express)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + Bcrypt
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer

**Key Routes**:
- `/api/v1/user` - Authentication & Profile
- `/api/v1/job` - Job Management
- `/api/v1/company` - Company Management
- `/api/v1/application` - Job Applications
- `/api/v1/report/issue` - Issue Reporting

### **Frontend Stack** (React/Vite)
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State**: Redux Toolkit
- **UI**: Shadcn/UI + Radix UI + Chakra UI
- **Styling**: Tailwind CSS
- **3D**: Three.js + React-three-fiber

**Key Pages**:
- Home, Login, Signup
- Browse Jobs, Job Details
- Application Status
- Admin: Companies, Jobs, Applicants

---

## 🎯 Core Functionalities

### **Student Features**
1. ✅ Signup/Login (Email + OTP)
2. ✅ Browse & Filter Jobs
3. ✅ Apply for Jobs
4. ✅ Track Application Status
5. ✅ Profile Management
6. ✅ Change Password
7. ✅ Delete Account

### **Recruiter Features**
1. ✅ Signup/Login
2. ✅ Register Company
3. ✅ Post Jobs
4. ✅ View Applicants
5. ✅ Update Application Status
6. ✅ Company Management

### **Common Features**
1. ✅ Report Issues
2. ✅ Dark Mode Support
3. ✅ Responsive Design
4. ✅ Profile Picture Upload

---

## 🚀 Running the Project

### **Terminal 1: Backend**
```bash
cd server
npm run dev
```
Server runs on port `8200` with auto-reload via Nodemon

### **Terminal 2: Frontend**
```bash
cd client
npm run dev
```
Frontend runs on port `5174` with Vite hot reload

### **Access the App**
Open: `http://localhost:5174`

---

## 🐛 Troubleshooting Guide

### **Issue: 500 Internal Server Error on Signup**
**Checklist**:
1. ✅ Both services running? Check terminals
2. ✅ MongoDB connected? Check backend logs
3. ✅ CORS enabled? Check `CLIENT_URL` in `.env`
4. ✅ Env variables correct? Run `npm run dev` after updating `.env`

**Debug Steps**:
- Check backend console for exact error: `console.log` in signup controller
- Verify FormData fields match controller expectations
- Ensure Cloudinary credentials are valid

### **Issue: CORS Error**
**Solution**:
- Update `CLIENT_URL` in [server/.env](server/.env)
- Restart backend server (auto-reload via nodemon)
- Clear browser cache if needed

### **Issue: Frontend can't reach backend**
1. Verify `VITE_SERVER_URL` in [client/.env](client/.env)
2. Check if backend is running on specified port
3. Check browser DevTools Network tab for API calls

### **Issue: Image Upload Fails**
1. Verify Cloudinary credentials in `.env`
2. Check multer is configured correctly
3. Ensure file size is within limits

---

## 🔐 Security Warnings ⚠️

**Your credentials are exposed!** ⚠️⚠️⚠️

**Immediate Actions Required**:
1. Change MongoDB password on MongoDB Atlas
2. Regenerate Cloudinary API Secret
3. Create new Gmail App Password
4. Generate new JWT_SECRET

**Best Practices**:
- Never commit `.env` files to git
- Add `.env` to `.gitignore`
- Use strong, unique secrets (min 32 chars)
- Rotate credentials regularly
- Use different secrets for dev/production

---

## 📊 API Request/Response Flow

### **Signup Request**
```javascript
POST /api/v1/user/signup
Content-Type: multipart/form-data

{
  fullName: string,
  email: string,
  phoneNumber: string,
  password: string,
  role: "student" | "recruiter",
  file: File (optional)
}
```

### **Signup Response (Success)**
```javascript
{
  success: true,
  message: "User created successfully.",
  user: {
    _id: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    role: string,
    profile: {
      profilePicture: string (URL)
    }
  }
}
```

---

## 🛠️ Configuration Files

### [server/vite.config.js](server/vite.config.js)
- Port: 5174
- Hot reload enabled
- Path alias: `@` → `./src`

### [server/.env](server/.env)
- Port: 8200
- CORS: http://localhost:5174
- Database: MongoDB Atlas

### [client/jsconfig.json](client/jsconfig.json)
- Path alias: `@` → `./src`
- Enables import from `@/components`

---

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run database seed (if available)
npm run seed

# Format code
npm run lint

# Preview production build
npm run preview
```

---

## 🎓 Learning Resources

### Frontend Technologies
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

### Backend Technologies
- [Express.js](https://expressjs.com)
- [MongoDB](https://mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [JWT](https://jwt.io)
- [Cloudinary](https://cloudinary.com)

---

## 📞 Support

For issues:
1. Check backend console logs
2. Check browser DevTools Network tab
3. Verify all `.env` variables are set
4. Ensure both services are running
5. Clear browser cache and restart services

---

**Last Updated**: January 29, 2026  
**Status**: ✅ Fully Functional
