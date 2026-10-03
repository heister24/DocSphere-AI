import express from "express";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";
import documentRouter from "./routes/document.routes.js";

const app = express();

const port = process.env.PORT;

await connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Document health is good");
});

app.use("/", documentRouter);

app.listen(port, () => {
  console.log(`Document server running on port ${port}`);
});
