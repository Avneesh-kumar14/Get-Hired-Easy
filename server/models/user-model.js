import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    gender:{
      type:String,
      enum:["male","female","other"]
    },
    social:{
      linkedin:{
        type:String
      },
      github:{
        type:String
      }
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
    },
    phoneNumber: {
      type: String,
      required:true,
      unique: true,
      match: [/^\d{10,11}$/, "Please enter a valid 10-11 digit phone number"],
    },
    password: {
      type: String,
      required:true
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: {
        type: String,
        trim: true,
      },
      skills: {
        type: [String],
      },
      resume: {
        type: String,
      },
      resumeOriginalName: {
        type: String,
      },
      profilePicture: {
        type: String,
        default: "",
      },
    },
    resumeAnalysis: {
      suggestions: [
        {
          category: {
            type: String,
            enum: ["skills", "format", "content", "keywords", "structure"],
          },
          title: String,
          description: String,
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
          },
        },
      ],
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      analyzedAt: Date,
      analyzedResume: String,
      analyzedResumeOriginalName: String,
    },

  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
