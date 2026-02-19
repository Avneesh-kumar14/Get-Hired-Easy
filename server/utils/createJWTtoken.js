import jwt from "jsonwebtoken";

/**
 * Create JWT token for user authentication
 * Expiry: 1 hour (increased security - tokens expire quickly)
 * Use refresh tokens for longer sessions in production
 */
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { 
    expiresIn: "1h", // Security: Short expiry for better security
  });
};

export default createToken