import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Auth DB connected on host ${conn.connection.host}`);
  } catch (error) {
    console.log(`Database connection error at Auth Service : ${error}`);
  }
};

export default connectDB