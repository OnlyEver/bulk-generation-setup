import express from "express";
import { sendGeneration } from "./generation-jobs/send_generation";
import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";

import {
  addGenerationTask,
  closeGenerationQueue,
} from "./queue-implementation/generation-queue";
import { generationWorker } from "./queue-implementation/generation_worker";
const app = express();

const PORT = process.env.PORT || 3000;

// app.get("/", (req: any, res: any) => {
//   res.send("Hello, world!");
// });

// app.get("/send-generation", async (req: any, res: any) => {
//   const data = await sendGeneration();
//   res.send(data);
// });

// app.get("/check-status", async (req: Request, res: any) => {
//   // const data = await checkBatchStatus("1");
// const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
//   const data = await checkBatchStatus("batch_677d070dfd008190ad9b8a48cf6717e4");
//   // batch_677d070dfd008190ad9b8a48cf6717e4
//   res.send(data);
// });
// app.get("/get-results", async (req: any, res: any) => {
//   // const data = await checkBatchStatus("1");
//   const data = await getResult("file-VYk48giUdr2NLJ5cDGcCW2");
//   // batch_677d070dfd008190ad9b8a48cf6717e4
//   res.send(data);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const generationData = {
  id: "1",
  name: "Generation 1",
};
// await closeGenerationQueue();
(async () => {
  await addGenerationTask(generationData);

  generationWorker.on("completed", (job: any) => {
    console.log("Generation job completed", job.id);
    generationWorker.close();
  });
  generationWorker.on("failed", (job: any, err: any) => {
    console.log("Generation job failed", job.id, err.message);
  });

  process.on("SIGINT", async () => {
    console.log("Closing the generation queue");
    await Promise.all([closeGenerationQueue(), generationWorker.close()]);
  });
})();
