import express from "express";

import isAuthenticated from "../middleware/auth-middleware.js";
import {
  filterJobs,
  getAdminJobs,
  getAllJobs,
  getJobById,
  PostJob,
} from "../controllers/job-controller.js";

const Router = express.Router();
Router.post("/post", isAuthenticated, PostJob);
Router.get("/get", getAllJobs);
Router.get("/get/:id", getJobById);
Router.get("/getadminjobs", isAuthenticated, getAdminJobs);
Router.post('/filter',filterJobs)
export default Router;
