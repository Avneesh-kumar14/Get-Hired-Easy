import jwt from "jsonwebtoken";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

export default createToken