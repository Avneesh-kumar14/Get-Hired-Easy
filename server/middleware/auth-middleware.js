import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

export default isAuthenticated;
