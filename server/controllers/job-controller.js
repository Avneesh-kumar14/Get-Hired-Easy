import JobModel from "../models/job-model.js";
import { parseSalaryFilter } from "../utils/constants/parseSalaryFilter.js";

export const PostJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      experience,
      salary,
      location,
      jobType,
      expiryDate,
      position,
      companyId,
    } = req.body;
    const userId = req.userId;
    if (
      !title ||
      !experience ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !expiryDate ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
        success: false,
      });
    }
    if (isNaN(salary) || salary <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid salary.", success: false });
    }
    if (new Date(expiryDate) < Date.now()) {
      return res.json({
        success: false,
        message: "Expiration date must be in the future.",
      });
    }
    const job = await JobModel.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experienceLevel: experience,
      location,
      jobType,
      expiryDate,
      position,
      company: companyId,
      createdBy: userId,
    });
    return res.status(201).json({
      message: "New Job Created Successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const keywordPatterns = keyword
      .split(" ")
      .map((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return `(${escaped})`;
      })
      .join("[-\\s]?/?[-\\s]?");

      let jobs = await JobModel.aggregate([
        // Lookup for company data
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyData",
          },
        },
        // Lookup for application data
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "job", 
            as: "applications",
          },
        },
        // Match jobs based on keyword patterns in specified fields
        {
          $match: {
            $or: [
              { title: { $regex: keywordPatterns, $options: "i" } },
              { description: { $regex: keywordPatterns, $options: "i" } },
              { jobType: { $regex: keywordPatterns, $options: "i" } },
              { "companyData.name": { $regex: keywordPatterns, $options: "i" } },
              { "companyData.website": { $regex: keywordPatterns, $options: "i" } },
              { "companyData.location": { $regex: keywordPatterns, $options: "i" } },
            ],
          },
        },
        // Sort jobs by creation date in descending order
        {
          $sort: { createdAt: -1 },
        },
        // Add the company data as a single object instead of an array
        {
          $addFields: {
            company: { $arrayElemAt: ["$companyData", 0] },
          },
        },
        // Project fields to exclude companyData array after adding it as a single object
        {
          $project: {
            companyData: 0,
          },
        },
      ]);
      
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        message: "No Job Found",
        success: true,
      });
    }
    jobs = jobs?.filter((job) => new Date(job?.expiryDate) >= Date.now());
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId)
      .populate({
        path: "applications",
      })
      .populate({
        path: "company",
      });
    if (!job) {
      return res.status(404).json({
        message: "No Job Found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.userId;
    const jobs = await JobModel.find({
      createdBy: adminId,
    }).populate({
      path: "company",
    });
    if (!jobs) {
      return res.status(404).json({
        message: "No Job Found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const filterJobs = async (req, res) => {
  try {
    const { titleList, salary, location, jobType, experienceLevel } = req.body;
    // console.log(titleList)
    const filter = {};
    if (titleList && Array.isArray(titleList) && titleList.length > 0) {
      filter.title = {
        $regex: titleList.map((title) => `${title}`).join("|"),
        $options: "i",
      };
    }
    if (salary && typeof salary === "string") {
      const salaryFilter = parseSalaryFilter(salary);
      if (salaryFilter) {
        filter.salary = salaryFilter;
      }
    }
    if (location && typeof location === "string") {
      filter.location = { $regex: new RegExp(location, "i") };
    }
    if (jobType && typeof jobType === "string") {
      filter.jobType = { $regex: new RegExp(jobType, "i") };
    }
    if (experienceLevel && !isNaN(Number(experienceLevel))) {
      filter.experienceLevel = { $gte: Number(experienceLevel) };
    }
    const jobs = await JobModel.find(filter).populate({
      path: "company",
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};
