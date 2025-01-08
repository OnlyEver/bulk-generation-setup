import express from "express";
import { sendGeneration } from "./send_generation";
import { checkBatchStatus } from "./check_batch_status";
import { getResult } from "./get_result";
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.send("Hello, world!");
});

app.get("/send-generation", async (req: any, res: any) => {
  const data = await sendGeneration();
  res.send(data);
});

app.get("/check-status", async (req: any, res: any) => {
  // const data = await checkBatchStatus("1");
  const data = await checkBatchStatus("batch_677e0d7e240881909bae053adf7126d2");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});
app.get("/get-results", async (req: any, res: any) => {
  // const data = await checkBatchStatus("1");
  const data = await getResult("file-VYk48giUdr2NLJ5cDGcCW2");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
