import express from "express";
import isAuthenticated from "../middleware/auth-middleware.js";
import { multipleAttachmentUpload } from "../middleware/multer.js";
import { PostIssue } from "../controllers/report-issue-controller.js";
const Router = express.Router();

Router.post("/post", isAuthenticated, multipleAttachmentUpload, PostIssue);

export default Router;
