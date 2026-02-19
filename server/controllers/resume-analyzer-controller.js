import UserModel from "../models/user-model.js";
import { analyzeResume, analyzeResumeWithAI, generateImprovedResumeText } from "../utils/resumeAnalyzer.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";

/**
 * Analyze student's resume and provide AI-powered suggestions
 * POST /api/resume/analyze
 */
export const analyzeStudentResume = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access.",
        success: false,
      });
    }

    if (!file) {
      return res.status(400).json({
        message: "Resume file is required.",
        success: false,
      });
    }

    // Security: Validate file MIME type
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only PDF and DOCX files are allowed.",
        success: false,
      });
    }

    // Security: Limit file size (2MB)
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return res.status(400).json({
        message: "File size exceeds maximum limit of 2MB.",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Extract text from file
    let resumeText = file.buffer.toString("utf-8").trim();

    // If it's a buffer, try to extract text
    if (!resumeText || resumeText.length < 50) {
      // For binary files like PDF, we'll work with what we have
      resumeText = file.originalname || "";
    }

    // Security: Sanitize and limit resume text to prevent token overflow
    // Limit to 6000 characters to avoid expensive API calls
    resumeText = sanitizeResumeText(resumeText).substring(0, 6000);

    if (resumeText.length < 50) {
      return res.status(400).json({
        message: "Resume text is too short or invalid.",
        success: false,
      });
    }

    // Use AI-powered analysis if enabled, otherwise use pattern-matching
    const analysis = await analyzeResumeWithAI(resumeText);

    // Store analysis in database
    user.resumeAnalysis = {
      suggestions: analysis.suggestions,
      score: analysis.score,
      analyzedAt: new Date(),
      aiPowered: analysis.aiPowered,
    };

    await user.save();

    return res.status(200).json({
      message: "Resume analysis completed successfully.",
      analysis: {
        score: analysis.score,
        suggestions: analysis.suggestions,
        wordCount: analysis.wordCount,
        skillsFound: analysis.skillsFound,
        metricsFound: analysis.metricsFound,
        sectionCount: analysis.sectionCount,
        aiPowered: analysis.aiPowered,
      },
      success: true,
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    // Security: Don't expose internal errors to client
    return res.status(500).json({
      message: "Error analyzing resume. Please try again later.",
      success: false,
    });
  }
};

/**
 * Sanitize resume text to prevent prompt injection and remove sensitive data
 * Removes potential harmful patterns and ensures safety for AI processing
 */
function sanitizeResumeText(text) {
  if (!text) return "";

  // Remove potential prompt injection patterns
  let sanitized = text
    // Remove instructions that might override system prompt
    .replace(/ignore (all )?previous instructions?/gi, "[removed]")
    .replace(/system prompt/gi, "[removed]")
    .replace(/you are now/gi, "[removed]")
    .replace(/forget everything/gi, "[removed]")
    .replace(/act as|play the role of/gi, "[removed]")
    // Remove potential API keys or sensitive patterns
    .replace(/api[_-]?key|api[_-]?secret|bearer\s+\S+/gi, "[removed]")
    .replace(/mongodb[_-]?url|database[_-]?url/gi, "[removed]")
    // Clean up excessive special characters
    .replace(/[^\w\s.,;:\-()&@#]/g, " ")
    // Remove multiple spaces
    .replace(/\s+/g, " ")
    .trim();

  return sanitized;
}

/**
 * Get resume analysis for current user
 * GET /api/resume/analysis
 */
export const getResumeAnalysis = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access.",
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select("resumeAnalysis");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (!user.resumeAnalysis || user.resumeAnalysis.suggestions.length === 0) {
      return res.status(200).json({
        message: "No analysis available yet.",
        analysis: null,
        success: true,
      });
    }

    return res.status(200).json({
      analysis: user.resumeAnalysis,
      success: true,
    });
  } catch (error) {
    console.error("Get resume analysis error:", error);
    return res.status(500).json({
      message: "Error retrieving resume analysis.",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Upload improved resume to user profile
 * POST /api/resume/upload-improved
 */
export const uploadImprovedResume = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access.",
        success: false,
      });
    }

    if (!file) {
      return res.status(400).json({
        message: "Resume file is required.",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Upload to cloudinary
    const fileUri = getDataUri(file);
    const uploadedResume = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "auto",
    });

    // Update user's analyzed resume
    user.resumeAnalysis.analyzedResume = uploadedResume.secure_url;
    user.resumeAnalysis.analyzedResumeOriginalName = file.originalname;
    await user.save();

    return res.status(200).json({
      message: "Improved resume uploaded successfully.",
      resume: {
        url: uploadedResume.secure_url,
        name: file.originalname,
      },
      success: true,
    });
  } catch (error) {
    console.error("Upload improved resume error:", error);
    return res.status(500).json({
      message: "Error uploading improved resume.",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Apply analyzed resume to user profile
 * POST /api/resume/apply-to-profile
 */
export const applyAnalyzedResumeToProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access.",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (
      !user.resumeAnalysis ||
      !user.resumeAnalysis.analyzedResume
    ) {
      return res.status(400).json({
        message: "No improved resume available. Please upload first.",
        success: false,
      });
    }

    // Update profile with analyzed resume
    user.profile.resume = user.resumeAnalysis.analyzedResume;
    user.profile.resumeOriginalName = user.resumeAnalysis.analyzedResumeOriginalName;
    await user.save();

    return res.status(200).json({
      message: "Analyzed resume applied to profile successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("Apply analyzed resume error:", error);
    return res.status(500).json({
      message: "Error applying analyzed resume to profile.",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Clear resume analysis
 * DELETE /api/resume/analysis
 */
export const clearResumeAnalysis = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access.",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    user.resumeAnalysis = {
      suggestions: [],
      score: 0,
      analyzedAt: null,
      analyzedResume: null,
      analyzedResumeOriginalName: null,
    };
    await user.save();

    return res.status(200).json({
      message: "Resume analysis cleared.",
      success: true,
    });
  } catch (error) {
    console.error("Clear resume analysis error:", error);
    return res.status(500).json({
      message: "Error clearing resume analysis.",
      error: error.message,
      success: false,
    });
  }
};
