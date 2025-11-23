# Get Hired Easy - Full Stack Job Portal

A modern, full-featured job search and recruitment platform built with **MERN stack** (MongoDB, Express, React, Node.js). Connect job seekers with employers seamlessly.

## 🌟 Features

### For Job Seekers
- 🔍 **Search & Filter Jobs** - Filter by title, location, experience level, and salary
- 📋 **Job Applications** - Apply to jobs with one click
- 👤 **Profile Management** - Build and update your professional profile
- 📊 **Application Tracking** - View status of all your applications
- 🔐 **Secure Authentication** - OTP-based login with password recovery
- 🎨 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Recruiters
- 💼 **Post Jobs** - Create and manage job postings
- 🏢 **Company Management** - Set up and customize company profile
- 👥 **View Applicants** - Track all applicants for your jobs
- 📧 **Email Notifications** - Get alerts for new applications
- ⚙️ **Job Management** - Edit, delete, and manage job postings

### General Features
- 🔐 **JWT Authentication** - Secure token-based auth
- 📧 **Email Notifications** - Automated emails for key events
- ☁️ **Cloud Storage** - Cloudinary integration for image uploads
- 🎯 **3D Components** - Interactive 3D Globe visualization
- 🗄️ **MongoDB Database** - Flexible, scalable data storage

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, Vite, Redux, Tailwind CSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JWT, Bcrypt, Passport.js |
| **File Storage** | Cloudinary |
| **Email Service** | Nodemailer |
| **Containerization** | Docker, Docker Compose |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Git**

Optional:
- **Docker** (for containerized deployment)
- **Cloudinary** account (for image uploads)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Avneesh-kumar14/Get-Hired-Easy.git
cd Get-Hired-Easy
```

### 2. Setup Backend (Server)

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `server/.env` and add your credentials:
```env
PORT=8000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp
SECRET_KEY=your-random-secret-key-here
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
EMAIL_USER=your-email@gmail.com
PASS_USER=your-app-specific-password
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CLIENT_ID=your-google-client-id
SESSION_SECRET=your-session-secret
```

**How to get these credentials:**

- **MongoDB URL**: [Create Atlas cluster](https://www.mongodb.com/cloud/atlas) (free tier)
- **Cloudinary Keys**: [Sign up at Cloudinary](https://cloudinary.com/)
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
- **Email Password**: Generate [Gmail App Password](https://support.google.com/accounts/answer/185833)

#### Seed Database (Optional - Adds Sample Data)
```bash
npm run seed
```

This will populate your database with:
- 3 recruiter accounts
- 3 companies
- 6 sample job postings
- 4 student accounts

#### Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:8000`

---

### 3. Setup Frontend (Client)

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

#### Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🧪 Test Credentials

### Student Account
```
Email: rohit.sharma@email.com
Password: password123
```

### Recruiter Account
```
Email: rajesh@techcorp.com
Password: password123
```

**Additional test accounts available in the seed data - check `server/scripts/seed.js`**

---

## 📁 Project Structure

```
Get-Hired-Easy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Redux state management
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Express middleware
│   ├── utils/            # Helper functions
│   ├── scripts/
│   │   └── seed.js       # Database seeding script
│   ├── app.js            # Express app setup
│   └── package.json
│
├── docker-compose.yml    # Docker configuration
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `POST /api/v1/user/request-otp` - Request OTP
- `POST /api/v1/user/verify-otp` - Verify OTP

### Jobs
- `GET /api/v1/job/get` - Get all jobs
- `GET /api/v1/job/get/:id` - Get job by ID
- `POST /api/v1/job/post` - Post new job (Recruiter only)
- `PUT /api/v1/job/:id` - Update job (Recruiter only)
- `DELETE /api/v1/job/:id` - Delete job (Recruiter only)

### Companies
- `GET /api/v1/company/get` - Get all companies
- `GET /api/v1/company/get/:id` - Get company by ID
- `POST /api/v1/company/register` - Register company (Recruiter only)
- `PUT /api/v1/company/update/:id` - Update company

### Applications
- `GET /api/v1/application/get` - Get user applications
- `POST /api/v1/application/apply` - Apply for job
- `GET /api/v1/application/:id` - Get application details

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- MongoDB container
- Backend server (port 8000)
- Frontend server (port 5173)

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

---

## 🔐 Security Best Practices

### Environment Variables
- **Never commit `.env` file** - It's already in `.gitignore`
- **Use `.env.example`** - Share template without secrets
- **Rotate credentials** - Especially after development

### Database
- **Use MongoDB Atlas** - Secure cloud hosting
- **Enable IP Whitelisting** - Restrict access to your IPs
- **Strong Passwords** - Use complex passwords for DB

### Deployment
- **Use HTTPS** - Always use HTTPS in production
- **Environment-specific configs** - Different `.env` for dev/prod
- **Regular backups** - Backup MongoDB regularly

---

## 🚀 Deployment

### Deploy to Cloud

#### Heroku / Railway
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables in dashboard
4. Deploy

#### AWS / DigitalOcean
1. Set up server/VM
2. Install Node.js and MongoDB
3. Clone repository
4. Configure `.env` with production values
5. Use PM2 or systemd for process management

---

## 📝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🤝 Support

- 📧 Email: support@gethriedeasy.com
- 💬 Issues: [GitHub Issues](https://github.com/Avneesh-kumar14/Get-Hired-Easy/issues)
- 📚 Documentation: Check wiki and guides

---

## 🎯 Future Enhancements

- [ ] Advanced filtering and search
- [ ] Video interview integration
- [ ] AI-powered job recommendations
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Newsletter subscription
- [ ] Skill verification system

---

## 👨‍💻 Author

**Rajneesh Avneesh Kumar**
- GitHub: [@Avneesh-kumar14](https://github.com/Avneesh-kumar14)
- LinkedIn: [Your LinkedIn](https://linkedin.com)

---

## 🙏 Acknowledgments

- MongoDB Atlas for database
- Cloudinary for image storage
- React community for amazing libraries
- All contributors and testers

---

**Happy Coding! 🚀**

---

**Last Updated:** November 2025
