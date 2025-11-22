import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('mongoDb connected')
  } catch (err) {
    console.error("Database Connection Failed", err.message);
    // rethrow so caller can decide how to handle startup failure
    throw err;
  }
};
export default connectDB