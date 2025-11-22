import { sendEmail } from "../config/nodemailer.js";
import getReportIssueEmailTemplate from "../email-templates/getApplyJobEmailTemplate.js";
import ReportIssueModel from "../models/report-issue-model.js";
import UserModel from "../models/user-model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";

export const PostIssue = async (req, res) => {
  try {
    const { issueType, priority, title, description, email, phoneNumber } =
      req.body;
    if (!issueType || !priority || !title || !description || !email) {
      return res.status(400).json({
        message: "Please fill required fields",
        success: false,
      });
    }
    const user = await UserModel.findById(req.userId);
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          const fileUri = getDataUri(file);
          const cloudFile = await cloudinary.uploader.upload(fileUri.content);
          uploadedFiles.push({
            url: cloudFile.secure_url,
            originalname: file.originalname,
            filetype: cloudFile.format,
          });
        } catch (error) {
          console.error(`Error uploading file ${file?.originalname}`);
        }
      }
    }
    const reportedIssue = await ReportIssueModel.create({
      type: issueType,
      priority,
      title,
      description,
      email,
      phoneNumber,
      attachments: uploadedFiles,
      reportedBy: req.userId,
    });
    try {
      const html = getReportIssueEmailTemplate(
        user?.fullName,
        issueType,
        description,
        reportedIssue?._id
      );
      sendEmail(
        process.env.EMAIL_USER,
        "Issue Reported Successfully",
        html,
        true
      );
    } catch (error) {
      console.log("Email not sent", error.message);
    }
    res.status(200).json({
      message: "Issue Reported Successfully",
      success: true,
      issue: reportedIssue,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
