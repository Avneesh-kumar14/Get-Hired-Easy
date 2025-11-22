import mongoose from "mongoose";

const ReportIssueSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    attachments: [
      {
        type: Object,
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ReportIssueModel = mongoose.model("Report", ReportIssueSchema);
export default ReportIssueModel;
