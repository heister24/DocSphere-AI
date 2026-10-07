import express from "express";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";
import documentRouter from "./routes/document.routes.js";
import { createQdrantCollection } from "./services/qdrant.service.js";
import chatRouter from "./routes/chat.routes.js";
import ragRouter from "./routes/rag.routes.js";
import conversationRouter from "./routes/conversation.routes.js";

const app = express();

const port = process.env.PORT;

app.use(express.json());

await connectDB();
await createQdrantCollection();

app.get("/health", (req, res) => {
  res.send("Document health is good");
});

app.use("/", documentRouter);
app.use("/", chatRouter);
app.use("/",ragRouter);
app.use("/", conversationRouter);

app.listen(port, () => {
  console.log(`Document server running on port ${port}`);
});
