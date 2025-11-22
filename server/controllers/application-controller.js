import ApplicationModel from "../models/application-model.js";
import JobModel from "../models/job-model.js";
import { sendEmail } from "../config/nodemailer.js";
import UserModel from "../models/user-model.js";
import getApplyJobEmailTemplate from "../email-templates/getApplyJobEmailTemplate.js";
import getWithdrawJobEmailTemplate from "../email-templates/getWithdrawJobEmailTemplate.js";
import getApplicationStatusEmailTemplate from "../email-templates/getApplicationStatusEmailTemplate.js";
export const applyJob = async (req, res) => {
  try {
    const userId = req.userId;
    const jobId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!jobId) {
      return res.status(400).json({
        message: "Job Id is required",
        success: false,
      });
    }

    const job = await JobModel.findById(jobId).populate({
      path: "company",
    });

    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    const existingApplication = await ApplicationModel.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "User has already applied for this job",
        success: false,
      });
    }

    const newApplication = await ApplicationModel.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    try {
      const html = getApplyJobEmailTemplate(
        user?.fullName,
        job?.title,
        job?.company?.name,
        job?.company?.logo
      );

      sendEmail(
        user.email,
        "Your Job Application Confirmation - Thank You for Applying!",
        html,
        true
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(200).json({
      message: "Job Applied Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const withdrawJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        message: "Job Id is required",
        success: false,
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User Id is required",
        success: false,
      });
    }

    const [user, job] = await Promise.all([
      UserModel.findById(userId),
      JobModel.findById(jobId).populate('company')
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const existingApplication = await ApplicationModel.findOneAndDelete({
      job: jobId,
      applicant: userId,
    });

    if (!existingApplication) {
      return res.status(404).json({
        message: "User hasn't applied for this job yet",
        success: false,
      });
    }

    const updatedJob = await JobModel.findByIdAndUpdate(
      jobId,
      {
        $pull: { applications: existingApplication._id },
      },
      { new: true }
    );
    // console.log(updatedJob)
    try {
      const html = getWithdrawJobEmailTemplate(
        user?.fullName,
        job?.title,
        job?.company?.name,
        job?.company?.logo
      );
      
      sendEmail(
        user.email,
        "Job Application Withdrawal Confirmation",
        html,
        true
      );
    } catch (error) {
      console.error('Email sending failed:', error);
      
    }
    return res.status(200).json({
      message: "Application withdrawn successfully",
      success: true
    });

  } catch (error) {
    console.error('Withdraw job error:', error);
    return res.status(500).json({ 
      message: "Server error", 
      success: false,
    });
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.userId;
    let application = await ApplicationModel.find({
      applicant: userId,
      job: { $ne: null },
    }).populate({
      path: "job",
      match: { expiryDate: { $gte: new Date() } },
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },
      },
    });
    application = application.filter((app) => app?.job !== null);
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(400).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application = await ApplicationModel.findById(applicationId)
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .populate("applicant");

    if (!application) {
      return res.status(400).json({
        message: "Application not found",
        success: false,
      });
    }

    const lowerStatus = status.toLowerCase();
    if (lowerStatus !== "accepted" && lowerStatus !== "rejected") {
      return res.status(400).json({
        message:
          "Invalid status. Only 'accepted' or 'rejected' statuses are allowed.",
        success: false,
      });
    }

    application.status = lowerStatus;
    await application.save();

    try {
      const emailHtml = getApplicationStatusEmailTemplate(
        application,
        lowerStatus
      );
      sendEmail(
        application.applicant.email,
        `Job Application ${
          lowerStatus === "accepted" ? "Accepted" : "Status Update"
        }`,
        emailHtml
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(200).json({
      message: "Status updated Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
