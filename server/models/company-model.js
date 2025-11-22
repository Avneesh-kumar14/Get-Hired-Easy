import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    logo: {
      type: String,
    },
    email:{
      type:String,  
    },
    contact:{
      type:Number,
    },
    twitter:{
      type:String,  
    },
    linkedIn:{
      type:String, 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CompanyModel = mongoose.model("Company", CompanySchema);
export default CompanyModel;
