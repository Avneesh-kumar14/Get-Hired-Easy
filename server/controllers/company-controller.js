import ApplicationModel from "../models/application-model.js";
import CompanyModel from "../models/company-model.js";
import JobModel from "../models/job-model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";
export const RegisterCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(401).json({
        message: "Company name is required",
        success: false,
      });
    }
    let company = await CompanyModel.findOne({ name: companyName });
    if (company) {
      return res.status(401).json({
        message: "You can't register same company again",
        success: false,
      });
    }
    company = await CompanyModel.create({
      name: companyName,
      userId: req.userId,
    });
    return res.status(201).json({
      message: `${companyName} registered successfully.`,
      company,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
export const getCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companies = await CompanyModel.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "No companies Found",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCompanyById = async (req, res) => {
  try {
    const companyName = req.params.id;
    const company = await CompanyModel.findById(companyName);
    if (!company) {
      return res.status(404).json({
        message: "Company not Found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateCompanyById = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      location,
      email,
      contact,
      linkedIn,
      twitter,
    } = req.body;
    const file = req.file;
    let logo_url;
    if (file) {
      const fileUri = getDataUri(file);
      const logoContent = await cloudinary.uploader.upload(fileUri.content);
      logo_url = logoContent.secure_url;
    }
    const updateData = {
      name,
      description,
      website,
      location,
      logo: logo_url,
      email,
      twitter,
      contact,
      linkedIn,
    };
    const company = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!company) {
      return res.status(404).json({
        message: "Company not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company information updated",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const UnRegisterCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const company = await CompanyModel.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "No company found with this ID",
      });
    }
    const jobs = await JobModel.find({ company: companyId });

    for (const job of jobs) {
      await ApplicationModel.deleteMany({ job: job._id });
    }

    await JobModel.deleteMany({ company: companyId });

    await CompanyModel.findByIdAndDelete(companyId);

    return res.status(200).json({
      success: true,
      message: `${company.name} unregistered successfully, along with all associated jobs and applications`,
    });
  } catch (error) {
    console.error("Error in UnRegisterCompanyById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};
