import express from "express";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT;

await connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Auth server running on port ${port}`);
});
