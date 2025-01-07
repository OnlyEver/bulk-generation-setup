import express from "express";
import { sendGeneration } from "./src/send_generation.js";
import { checkBatchStatus } from "./src/check_batch_status.js";
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/send-generation", async (req, res) => {
  const data = await sendGeneration();
  res.send(data);
});

app.get("/check-status", async (req, res) => {
  // const data = await checkBatchStatus("1");
  const data = await checkBatchStatus('batch_677d070c405881909d5c6373fea1ab91');
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
