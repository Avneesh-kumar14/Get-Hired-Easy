import express from "express";
import cors from "cors";
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
const app = express();
// ensure dotenv loads the `.env` file that lives next to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 3000;

// ✅ CRITICAL: CORS MUST be configured BEFORE routes and BEFORE json parser
const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://get-hired-easy-onu8ltvgj-avneesh-kumar-s-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ Apply CORS to all routes (handles preflight)
app.use(cors(corsOption));

// ✅ MANDATORY: Handle OPTIONS requests explicitly
app.options("*", cors(corsOption));

// Now add other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/report/issue", reportIssueRoute);

// app.use(express.static(path.join(_dirname, "/client/dist")));
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
