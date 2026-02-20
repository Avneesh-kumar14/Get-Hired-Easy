import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * General login rate limiter
 * 5 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Don't rate limit if user is already authenticated
    return !!req.userId;
  },
});

/**
 * Resume Analysis rate limiter
 * Critical endpoint - limit strictly to prevent API abuse
 * 3 analyses per user per day
 * OR 10 per IP per hour
 */
export const resumeAnalysisLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: "Too many resume analyses. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.userId || ipKeyGenerator(req, res);
  },
});

/**
 * Database query limiter
 * Prevent brute force attacks on user searches
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: "Too many search requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter - applied to all endpoints
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests to this API. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  loginLimiter,
  resumeAnalysisLimiter,
  searchLimiter,
  generalLimiter,
};
