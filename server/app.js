import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import path from "path";
import { fileURLToPath } from "url";
import userRoute from "./routes/user-routes.js";
import companyRoute from "./routes/company-routes.js";
import jobRoute from "./routes/job-routes.js";
import applicationRoute from "./routes/application-route.js";
import reportIssueRoute from "./routes/report-issue-route.js";
import locationRoute from "./routes/location-routes.js";
import resumeAnalyzerRoute from "./routes/resume-analyzer-routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 8000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://get-hired-easy.vercel.app",
  "https://get-hired-easy-onu8ltvgj-avneesh-kumar-s-projects.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

// CORS Configuration (MUST be first middleware)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// Apply CORS before all routes and middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Apply Helmet for security headers (must be before other middleware)
app.use(helmet());

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/report/issue", reportIssueRoute);
app.use("/api/v1/location", locationRoute);
app.use("/api/v1/resume", resumeAnalyzerRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
    success: false,
  });
});

// Global error handler (must be last)
app.use(errorHandler);
// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
// });

// connect to DB first, then start listening
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server because DB connection failed:', err.message);
    process.exit(1);
  }
})();
