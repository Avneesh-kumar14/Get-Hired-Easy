import express from "express";
import {
  changePassword,
  DeleteAccount,
  login,
  loginByOtp,
  logout,
  signup,
  updateProfile,
  verifyOtp,
} from "../controllers/user-controller.js";
import isAuthenticated from "../middleware/auth-middleware.js";
import { multipleUpload, singleUpload } from "../middleware/multer.js";
const Router = express.Router();
Router.post("/signup", singleUpload, signup);
Router.post("/login", login);
Router.post("/login-by-otp", loginByOtp);
Router.post("/verify-otp", verifyOtp);
Router.delete("/logout", logout);
Router.post("/update-profile", isAuthenticated, multipleUpload, updateProfile);
Router.post("/change-password", changePassword);
Router.delete("/delete", isAuthenticated, DeleteAccount);
export default Router;
