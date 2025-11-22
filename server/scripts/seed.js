import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import CompanyModel from "../models/company-model.js";
import JobModel from "../models/job-model.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ MONGODB_URL not found in .env file");
  process.exit(1);
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// Hash password helper
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Seed function
async function seedDatabase() {
  try {
    console.log("\n🌱 Starting database seeding...\n");

    // Clear existing data (optional - comment out to preserve data)
    await UserModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await JobModel.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create recruiter users (for companies)
    console.log("👤 Creating recruiter users...");
    const recruiters = await UserModel.insertMany([
      {
        fullName: "Rajesh Kumar",
        email: "rajesh@techcorp.com",
        phoneNumber: "9876543210",
        password: await hashPassword("password123"),
        role: "recruiter",
        gender: "male",
        profile: {
          bio: "Hiring manager at TechCorp",
          skills: ["recruitment", "talent management"],
        },
      },
      {
        fullName: "Priya Singh",
        email: "priya@startupinc.com",
        phoneNumber: "8765432109",
        password: await hashPassword("password123"),
        role: "recruiter",
        gender: "female",
        profile: {
          bio: "Talent acquisition specialist at StartupInc",
          skills: ["hr", "recruitment"],
        },
      },
      {
        fullName: "Arjun Patel",
        email: "arjun@innovateit.com",
        phoneNumber: "7654321098",
        password: await hashPassword("password123"),
        role: "recruiter",
        gender: "male",
        profile: {
          bio: "CTO at InnovateIT Solutions",
          skills: ["tech recruitment", "team building"],
        },
      },
    ], { validateBeforeSave: false });
    console.log(`✅ Created ${recruiters.length} recruiter users`);

    // Create companies
    console.log("🏢 Creating companies...");
    const companies = await CompanyModel.insertMany([
      {
        name: "TechCorp Solutions",
        description:
          "Leading software development and IT consulting company",
        website: "https://techcorp.com",
        location: "Bangalore, India",
        logo: "https://via.placeholder.com/150?text=TechCorp",
        email: "hr@techcorp.com",
        contact: 9876543210,
        twitter: "@techcorp",
        linkedIn: "techcorp-solutions",
        userId: recruiters[0]._id,
      },
      {
        name: "StartupInc",
        description: "Innovative fintech startup disrupting the payment space",
        website: "https://startupinc.com",
        location: "Mumbai, India",
        logo: "https://via.placeholder.com/150?text=StartupInc",
        email: "careers@startupinc.com",
        contact: 8765432109,
        twitter: "@startupinc",
        linkedIn: "startupinc",
        userId: recruiters[1]._id,
      },
      {
        name: "InnovateIT Solutions",
        description: "Cloud infrastructure and DevOps services",
        website: "https://innovateit.com",
        location: "Hyderabad, India",
        logo: "https://via.placeholder.com/150?text=InnovateIT",
        email: "hello@innovateit.com",
        contact: 7654321098,
        twitter: "@innovateit",
        linkedIn: "innovateit-solutions",
        userId: recruiters[2]._id,
      },
    ]);
    console.log(`✅ Created ${companies.length} companies`);

    // Create job postings
    console.log("💼 Creating job postings...");
    const jobs = await JobModel.insertMany([
      {
        title: "Senior Full Stack Developer",
        description:
          "We are looking for an experienced full stack developer with expertise in MERN stack. You will work on building scalable web applications for our enterprise clients.",
        requirements: [
          "5+ years of experience in full stack development",
          "Proficiency in React, Node.js, MongoDB",
          "Strong understanding of REST APIs",
          "Experience with Docker and Kubernetes",
        ],
        salary: 1200000,
        experienceLevel: 5,
        location: "Bangalore, India",
        jobType: "Full-time",
        position: 3,
        company: companies[0]._id,
        createdBy: recruiters[0]._id,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        title: "Frontend Developer (React)",
        description:
          "Join our creative team to build beautiful and responsive user interfaces. You will collaborate with designers and backend developers to create amazing user experiences.",
        requirements: [
          "3+ years of React development experience",
          "Knowledge of Tailwind CSS and Material-UI",
          "Git and version control expertise",
          "Strong problem-solving skills",
        ],
        salary: 800000,
        experienceLevel: 3,
        location: "Mumbai, India",
        jobType: "Full-time",
        position: 2,
        company: companies[1]._id,
        createdBy: recruiters[1]._id,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Backend Developer (Node.js)",
        description:
          "Build robust and scalable backend systems. Work with microservices, databases, and cloud infrastructure. You will be part of a team that values code quality and best practices.",
        requirements: [
          "4+ years of Node.js development",
          "SQL and NoSQL database experience",
          "RESTful API design knowledge",
          "CI/CD pipeline experience",
        ],
        salary: 900000,
        experienceLevel: 4,
        location: "Hyderabad, India",
        jobType: "Full-time",
        position: 4,
        company: companies[2]._id,
        createdBy: recruiters[2]._id,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        title: "DevOps Engineer",
        description:
          "Help us scale our infrastructure and improve deployment processes. Work with cloud platforms, containerization, and monitoring tools.",
        requirements: [
          "3+ years of DevOps experience",
          "Docker and Kubernetes proficiency",
          "AWS or Azure experience",
          "Infrastructure as Code knowledge",
        ],
        salary: 950000,
        experienceLevel: 3,
        location: "Bangalore, India",
        jobType: "Full-time",
        position: 2,
        company: companies[0]._id,
        createdBy: recruiters[0]._id,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
  title: "Mechanical Design Engineer",
  description:
    "Responsible for designing mechanical systems, preparing CAD models, and collaborating with manufacturing teams.",
  requirements: [
    "3+ years of mechanical design experience",
    "Proficient in SolidWorks / AutoCAD",
    "Knowledge of manufacturing processes",
    "Thermal and structural analysis understanding",
  ],
  salary: 600000,
  experienceLevel: 3,
  location: "Pune, India",
  jobType: "Full-time",
  position: 2,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
},
{
  title: "Maintenance Engineer (Mechanical)",
  description:
    "Perform maintenance of mechanical machines, handle breakdown issues, and ensure smooth plant operation.",
  requirements: [
    "2+ years experience in machine maintenance",
    "Knowledge of pumps, motors, compressors",
    "Preventive maintenance skills",
  ],
  salary: 450000,
  experienceLevel: 2,
  location: "Chennai, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
},
      {
        title: "Data Scientist",
        description:
          "Work on cutting-edge machine learning projects. Build predictive models and analyze large datasets to drive business decisions.",
        requirements: [
          "3+ years of data science experience",
          "Python and R proficiency",
          "Machine Learning algorithms knowledge",
          "SQL and big data tools experience",
        ],
        salary: 1100000,
        experienceLevel: 3,
        location: "Mumbai, India",
        jobType: "Full-time",
        position: 1,
        company: companies[1]._id,
        createdBy: recruiters[1]._id,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
  title: "Embedded Systems Engineer",
  description:
    "Work on microcontroller programming, hardware interfacing, and IoT devices.",
  requirements: [
    "Experience with Arduino, PIC, ARM processors",
    "Strong C/C++ skills",
    "PCB design basics",
  ],
  salary: 700000,
  experienceLevel: 3,
  location: "Bangalore, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
},
{
  title: "Electronics Testing Engineer",
  description:
    "Test electronic circuits, prepare documentation, diagnose issues, and ensure device quality.",
  requirements: [
    "Basic electronics testing experience",
    "Knowledge of oscilloscopes, multimeters, sensors",
    "PCB debugging experience",
  ],
  salary: 400000,
  experienceLevel: 1,
  location: "Noida, India",
  jobType: "Full-time",
  position: 4,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
},{
  title: "Site Engineer (Civil)",
  description:
    "Supervise construction site activities, monitor progress, and ensure project quality.",
  requirements: [
    "3+ years construction site experience",
    "Knowledge of AutoCAD and project management",
    "Strong communication skills",
  ],
  salary: 550000,
  experienceLevel: 3,
  location: "Delhi, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
},
{
  title: "Structural Engineer",
  description:
    "Design structural components, analyze stress loads, and ensure safety standards.",
  requirements: [
    "Experience in STAAD Pro / ETABS",
    "2+ years in structural design",
    "Understanding of IS codes",
  ],
  salary: 800000,
  experienceLevel: 2,
  location: "Ahmedabad, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
},
{
  title: "Site Engineer (Civil)",
  description:
    "Supervise construction site activities, monitor progress, and ensure project quality.",
  requirements: [
    "3+ years construction site experience",
    "Knowledge of AutoCAD and project management",
    "Strong communication skills",
  ],
  salary: 550000,
  experienceLevel: 3,
  location: "Delhi, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
},
{
  title: "Structural Engineer",
  description:
    "Design structural components, analyze stress loads, and ensure safety standards.",
  requirements: [
    "Experience in STAAD Pro / ETABS",
    "2+ years in structural design",
    "Understanding of IS codes",
  ],
  salary: 800000,
  experienceLevel: 2,
  location: "Ahmedabad, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
},
{
  title: "Site Engineer (Civil)",
  description:
    "Supervise construction site activities, monitor progress, and ensure project quality.",
  requirements: [
    "3+ years construction site experience",
    "Knowledge of AutoCAD and project management",
    "Strong communication skills",
  ],
  salary: 550000,
  experienceLevel: 3,
  location: "Delhi, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
},
{
  title: "Structural Engineer",
  description:
    "Design structural components, analyze stress loads, and ensure safety standards.",
  requirements: [
    "Experience in STAAD Pro / ETABS",
    "2+ years in structural design",
    "Understanding of IS codes",
  ],
  salary: 800000,
  experienceLevel: 2,
  location: "Ahmedabad, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
},
{
  title: "UI/UX Designer",
  description:
    "Design user-friendly interfaces and improve product usability with modern UI trends.",
  requirements: [
    "Figma / Adobe XD expertise",
    "Portfolio with recent designs",
    "Understanding of design systems",
  ],
  salary: 750000,
  experienceLevel: 3,
  location: "Remote",
  jobType: "Full-time",
  position: 1,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
},
{
  title: "Graphic Designer",
  description:
    "Create graphics, posters, social media creatives and assist in branding.",
  requirements: [
    "Photoshop / Illustrator proficiency",
    "Creative design thinking",
    "Basic motion graphics is a plus",
  ],
  salary: 400000,
  experienceLevel: 1,
  location: "Pune, India",
  jobType: "Full-time",
  position: 2,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
},{
  title: "MERN Stack Intern",
  description:
    "Work with React, Node, Express, and MongoDB to support frontend and backend development.",
  requirements: [
    "Basic JS, React and Node knowledge",
    "Understanding of API integration",
  ],
  salary: 200000,
  experienceLevel: 0,
  location: "Remote",
  jobType: "Internship",
  position: 2,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
},{
  title: "PHP & Laravel Developer",
  description:
    "Build backend services and dashboards using PHP and Laravel framework.",
  requirements: [
    "2+ years PHP/Laravel experience",
    "MySQL and API integration",
    "Understanding of MVC architecture",
  ],
  salary: 600000,
  experienceLevel: 2,
  location: "Hyderabad, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
},{
  title: "Python Developer",
  description:
    "Work on backend services and automation scripts using Python, Django, and Flask.",
  requirements: [
    "Python proficiency",
    "Experience with Django or Flask",
    "Knowledge of PostgreSQL",
  ],
  salary: 900000,
  experienceLevel: 2,
  location: "Bangalore, India",
  jobType: "Full-time",
  position: 3,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
},{
  title: "Flutter App Developer",
  description:
    "Build Android & iOS mobile applications using Flutter framework.",
  requirements: [
    "1+ years Flutter development",
    "Dart language knowledge",
    "API and Firebase integration",
  ],
  salary: 550000,
  experienceLevel: 1,
  location: "Indore, India",
  jobType: "Full-time",
  position: 2,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
},

{
  title: "Junior Data Scientist",
  description:
    "Assist in building predictive models, analyzing datasets, and preparing business insights.",
  requirements: [
    "Strong Python skills",
    "Knowledge of NumPy, Pandas, Matplotlib",
    "Understanding of ML algorithms",
    "Basic SQL knowledge"
  ],
  salary: 600000,
  experienceLevel: 1,
  location: "Bangalore, India",
  jobType: "Full-time",
  position: 2,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
},{
  title: "Data Analyst (Power BI / Tableau)",
  description:
    "Create business dashboards, prepare reports, and transform raw data into visually meaningful content.",
  requirements: [
    "Proficiency in Power BI or Tableau",
    "Strong Excel and SQL",
    "Basic statistical knowledge",
    "Ability to present insights clearly"
  ],
  salary: 550000,
  experienceLevel: 1,
  location: "Pune, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
},{
  title: "Machine Learning Engineer",
  description:
    "Build, optimize, and deploy ML models. Work with large datasets and modern ML frameworks.",
  requirements: [
    "3+ years in ML development",
    "Experience with TensorFlow/PyTorch",
    "Strong Python and SQL",
    "Experience with model deployment"
  ],
  salary: 1200000,
  experienceLevel: 3,
  location: "Hyderabad, India",
  jobType: "Full-time",
  position: 1,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
},{
  title: "Data Engineer",
  description:
    "Design and maintain data pipelines, ETL workflows, and distributed systems.",
  requirements: [
    "Strong SQL and Python",
    "Knowledge of Spark / Hadoop",
    "Experience with cloud platforms (AWS/GCP)",
    "ETL pipeline experience"
  ],
  salary: 1100000,
  experienceLevel: 3,
  location: "Gurgaon, India",
  jobType: "Full-time",
  position: 2,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
},
{
  title: "Junior Graphic Designer",
  description:
    "Create social media creatives, posters, banners, and assist the marketing team with visual content.",
  requirements: [
    "Adobe Photoshop / Illustrator",
    "Creativity and layout design skills",
    "Basic photo editing knowledge"
  ],
  salary: 350000,
  experienceLevel: 0,
  location: "Mumbai, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000)
},{
  title: "Manual Tester",
  description:
    "Test web and mobile applications manually, prepare bug reports, and ensure product quality.",
  requirements: [
    "Experience in test case writing",
    "Knowledge of SDLC & STLC",
    "Bug reporting tools (JIRA)"
  ],
  salary: 400000,
  experienceLevel: 1,
  location: "Kolkata, India",
  jobType: "Full-time",
  position: 3,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
},{
  title: "Automation Tester (Selenium)",
  description:
    "Build automation test scripts and maintain automated testing frameworks.",
  requirements: [
    "Experience with Selenium / Cypress",
    "Java or Python knowledge",
    "CI/CD and test scripting experience"
  ],
  salary: 700000,
  experienceLevel: 2,
  location: "Bangalore, India",
  jobType: "Full-time",
  position: 2,
  company: companies[2]._id,
  createdBy: recruiters[2]._id,
  expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
},{
  title: "QA Analyst",
  description:
    "Perform regression testing, API testing, and collaborate with developers for issue resolution.",
  requirements: [
    "Knowledge of API testing tools (Postman)",
    "Basic SQL",
    "Agile testing experience"
  ],
  salary: 550000,
  experienceLevel: 1,
  location: "Pune, India",
  jobType: "Full-time",
  position: 2,
  company: companies[0]._id,
  createdBy: recruiters[0]._id,
  expiryDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000)
},{
  title: "Senior QA Automation Engineer",
  description:
    "Lead QA automation efforts, write complex test frameworks, and improve CI/CD integration.",
  requirements: [
    "5+ years automation testing",
    "Selenium, Cypress, Playwright",
    "API automation + CI/CD"
  ],
  salary: 1200000,
  experienceLevel: 5,
  location: "Mumbai, India",
  jobType: "Full-time",
  position: 1,
  company: companies[1]._id,
  createdBy: recruiters[1]._id,
  expiryDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000)
},
      {
        title: "QA Engineer (Automation)",
        description:
          "Ensure product quality through automated testing. Write test scripts and maintain testing frameworks.",
        requirements: [
          "2+ years of QA automation experience",
          "Selenium or similar tool expertise",
          "Java or Python knowledge",
          "Familiar with CI/CD pipelines",
        ],
        salary: 650000,
        experienceLevel: 2,
        location: "Hyderabad, India",
        jobType: "Full-time",
        position: 3,
        company: companies[2]._id,
        createdBy: recruiters[2]._id,
        expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      },

    ]);
    console.log(`✅ Created ${jobs.length} job postings`);

    // Create student users
    console.log("🎓 Creating student users...");
    const students = await UserModel.insertMany([
      {
        fullName: "Rohit Sharma",
        email: "rohit.sharma@email.com",
        phoneNumber: "9123456780",
        password: await hashPassword("password123"),
        role: "student",
        gender: "male",
        profile: {
          bio: "Aspiring full stack developer",
          skills: ["JavaScript", "React", "Node.js", "MongoDB"],
          profilePicture: "https://via.placeholder.com/150?text=Rohit",
        },
      },
      {
        fullName: "Anjali Gupta",
        email: "anjali.gupta@email.com",
        phoneNumber: "8123456789",
        password: await hashPassword("password123"),
        role: "student",
        gender: "female",
        profile: {
          bio: "Frontend developer with passion for UI/UX",
          skills: ["React", "CSS", "JavaScript", "Figma"],
          profilePicture: "https://via.placeholder.com/150?text=Anjali",
        },
      },
      {
        fullName: "Vikram Singh",
        email: "vikram.singh@email.com",
        phoneNumber: "7123456780",
        password: await hashPassword("password123"),
        role: "student",
        gender: "male",
        profile: {
          bio: "Backend developer exploring cloud technologies",
          skills: ["Node.js", "Python", "AWS", "Docker"],
          profilePicture: "https://via.placeholder.com/150?text=Vikram",
        },
      },
      
      {
        fullName: "Neha Verma",
        email: "neha.verma@email.com",
        phoneNumber: "6123456789",
        password: await hashPassword("password123"),
        role: "student",
        gender: "female",
        profile: {
          bio: "Data enthusiast learning machine learning",
          skills: ["Python", "SQL", "ML", "Data Analysis"],
          profilePicture: "https://via.placeholder.com/150?text=Neha",
        },
      },
    ], { validateBeforeSave: false });
    console.log(`✅ Created ${students.length} student users`);

    console.log("\n✨ Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Recruiters: ${recruiters.length}`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Job Postings: ${jobs.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log("\n💡 You can now:");
    console.log("   1. Search for jobs by title or location");
    console.log("   2. View job details and apply");
    console.log("   3. Login as recruiter to post more jobs");
    console.log("\n🔑 Test credentials:");
    console.log("   Recruiter: rajesh@techcorp.com / password123");
    console.log("   Student: rohit.sharma@email.com / password123\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

// Run seeding
connectDB().then(() => seedDatabase());
