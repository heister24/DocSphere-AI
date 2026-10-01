import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouteProxy from "./routes/authProxy.js";

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRouteProxy);

app.get("/health", (req, res) => {
  res.send(`Gateway health is good`);
});

app.listen(port, () => {
  console.log(`Gateway server running on port ${port}`);
});
