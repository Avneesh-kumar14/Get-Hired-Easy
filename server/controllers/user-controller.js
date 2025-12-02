import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import createToken from "../utils/createJWTtoken.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { generateOTP } from "../utils/constants/generateOtp.js";
import { sendEmail } from "../config/nodemailer.js";
import hashPassword from "../utils/constants/hashPassword.js";
import getLoginOTPTemplate from "../email-templates/getLoginOTPTemplate.js";
import JobModel from "../models/job-model.js";
import ApplicationModel from "../models/application-model.js";
import CompanyModel from "../models/company-model.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, role, password } = req.body;
    const file = req.file ? req.file : null;
    let profilePictureurl;
    if (file) {
      const fileUri = getDataUri(file);
      profilePictureurl = await cloudinary.uploader.upload(fileUri.content);
    }
    if (!fullName || !email || !phoneNumber || !role || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use.", success: false });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create({
      fullName,
      email,
      phoneNumber,
      role,
      password: hashedPassword,
      profile: {
        profilePicture: profilePictureurl?.secure_url,
      },
    });

    const token = createToken(newUser?._id);
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path:"/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const user = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      profile: newUser.profile,
    };
    res.status(201).json({
      message: "User created successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email and password and Role are required.",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not Found.", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with this Role.",
        success: false,
      });
    }
    const token = createToken(user?._id);
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path:"/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: `Welcome back ${user.fullName}`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        profile: user.profile,
        gender:user.gender,
        social:user.social,
      },
      success: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
      success: false,
    });
  }
};
export const loginByOtp = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({
      message: "Email and role are required.",
      success: false,
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with this Role.",
        success: false,
      });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      const html = getLoginOTPTemplate(user?.fullName, otp);
      sendEmail(email, "Your OTP Code for GetHiredEasy Login", html);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending OTP",
      success: false,
      error: error.message,
    });
  }
};
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) {
    return res.status(400).json({
      message: "Otp is required",
      success: false,
    });
  }
  const user = await UserModel.findOne({ email });

  if (user.otpExpires < Date.now()) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(400).json({
      message: "OTP has expired. Please request a new one.",
      success: false,
    });
  }
  if (otp !== user.otp) {
    return res.status(400).json({ message: "User not found.", success: false });
  }
  user.otp = null;
  user.otpExpires = null;
  await user.save();
  const token = createToken(user._id);
  res.cookie("jwtToken", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: `Welcome back ${user.fullName}`,
    user: {
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
    success: true,
  });
};
export const logout = (req, res) => {
  res.cookie("jwtToken", "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logout successful.", success: true });
};
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      skills,
      bio,
      gender,
      github,
      linkedin,
    } = req.body;
    const userId = req.userId;
    const resume = req?.files?.resume?.length > 0 ? req.files.resume[0] : null;
    const profileImage =
      req?.files?.profileImage?.length > 0 ? req.files.profileImage[0] : null;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized access.", success: false });
    }

    if (!fullName || !email || !phoneNumber || !skills || !bio || !gender) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format.", success: false });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number format.", success: false });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }
    const skillsArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (skillsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one skill is required.", success: false });
    }

    let resumeUrl, profileImageUrl;
    if (resume) {
      const resumeUri = getDataUri(resume);
      const uploadedResume = await cloudinary.uploader.upload(
        resumeUri.content,
        { resource_type: "auto" }
      );
      resumeUrl = uploadedResume.secure_url;
    }
    if (profileImage) {
      const profileImageUri = getDataUri(profileImage);
      const uploadedImage = await cloudinary.uploader.upload(
        profileImageUri.content,
        { resource_type: "image" }
      );
      profileImageUrl = uploadedImage.secure_url;
    }
    user.fullName = fullName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.profile.skills = skillsArray;
    user.profile.bio = bio;
    user.gender = gender;
    user.social.github = github || "";
    user.social.linkedin = linkedin || "";
    if (resume) user.profile.resumeOriginalName = resume.originalname;
    if (resumeUrl) user.profile.resume = resumeUrl;
    if (profileImageUrl) user.profile.profilePicture = profileImageUrl;
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        role: user.role,
        profile: user.profile,
        social: user.social,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
      success: false,
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required.",
        success: false,
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    const user = await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Password updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
      success: false,
    });
  }
};
export const DeleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "You are not authenticated",
      });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.cookie("jwtToken", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });

    if (user.role === "student") {
      const applications = await ApplicationModel.find({ applicant: userId });
      const jobIds = applications.map((app) => app.job);
      await JobModel.updateMany(
        { _id: { $in: jobIds } },
        { $pull: { applications: { $in: applications.map((app) => app._id) } } }
      );

      await ApplicationModel.deleteMany({ applicant: userId });
    } else if (user.role === "recruiter") {
      const companies = await CompanyModel.find({ userId: userId });
      const companyIds = companies.map((company) => company._id);

      const jobs = await JobModel.find({ company: { $in: companyIds } });
      const jobIds = jobs.map((job) => job._id);

      await ApplicationModel.deleteMany({ job: { $in: jobIds } });
      await JobModel.deleteMany({ company: { $in: companyIds } });
      await CompanyModel.deleteMany({ userId: userId });
    }
    await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
