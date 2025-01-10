import express from "express";
import { sendGeneration } from "./generation-jobs/send_generation";
import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.send("Hello, world!");
});

app.get("/send-generation", async (req: any, res: any) => {
  const data = await sendGeneration();
  res.send(data);
});

app.get("/check-status", async (req: Request, res: any) => {
  // const data = await checkBatchStatus("1");
  // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
  // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
  // const data = await checkBatchStatus("batch_677f8b8d58d0819090918418f0402ebb"); //card gen batch
  // const data = await checkBatchStatus("batch_6780a1bde1dc81908175ebecb7eb8756"); //card gen batch
  // const data = await checkBatchStatus("batch_6780a390f2408190b58c6a0cdfd7a686"); //card gen batch
  const data = await checkBatchStatus("batch_6780a5c656f081909144eea4b5fea5b5"); //card gen batch
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});
app.get("/get-results", async (req: any, res: any) => {
  // const data = await checkBatchStatus("1");
  // const data = await getResult("file-4jyehGaJ145NnZBS5zkw2w");
  const data = await getResult("file-AwS7kdAgAhczAKHSa5QobL"); //card gen batch
  // const data = await getResult("file-AFf7HYu9brVBKGhBRgrv5h"); //card gen batch
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
