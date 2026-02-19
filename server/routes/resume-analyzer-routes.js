import express from "express";
import {
  analyzeStudentResume,
  getResumeAnalysis,
  uploadImprovedResume,
  applyAnalyzedResumeToProfile,
  clearResumeAnalysis,
} from "../controllers/resume-analyzer-controller.js";
import isAuthenticated from "../middleware/auth-middleware.js";
import { singleUpload } from "../middleware/multer.js";
import { resumeAnalysisLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * Resume Analyzer Routes
 */

// Analyze resume - with rate limiting to prevent API abuse
router.post(
  "/analyze",
  isAuthenticated,
  resumeAnalysisLimiter,
  singleUpload,
  analyzeStudentResume
);

// Get analysis results
router.get("/analysis", isAuthenticated, getResumeAnalysis);

// Upload improved resume
router.post(
  "/upload-improved",
  isAuthenticated,
  singleUpload,
  uploadImprovedResume
);

// Apply analyzed resume to profile
router.post("/apply-to-profile", isAuthenticated, applyAnalyzedResumeToProfile);

// Clear analysis
router.delete("/analysis", isAuthenticated, clearResumeAnalysis);

export default router;
