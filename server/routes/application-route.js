import express from "express";
import isAuthenticated from "../middleware/auth-middleware.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  withdrawJob,
} from "../controllers/application-controller.js";

const Router = express.Router();
Router.post("/apply/:id", isAuthenticated, applyJob);
Router.post("/withdraw/:id",isAuthenticated,withdrawJob);
Router.get("/get", isAuthenticated, getAppliedJobs);
Router.get("/:id/applicants", isAuthenticated, getApplicants);
Router.post("/status/:id/update", isAuthenticated, updateStatus)
export default Router;
