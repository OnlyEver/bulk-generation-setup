import express from "express";
import { sendGeneration } from "./src/send_generation.js";
import { checkBatchStatus } from "./src/check_batch_status.js";
import {
  addGenerationTask,
  closeGenerationQueue,
} from "./src/queue-implementation/generation-queue.js";
import { generationWorker } from "./src/queue-implementation/generation_worker.js";
const app = express();

const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });

// app.get("/send-generation", async (req, res) => {
//   const data = await sendGeneration();
//   res.send(data);
// });

// app.get("/check-status", async (req, res) => {
//   const data = await checkBatchStatus("1");
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
await addGenerationTask(generationData);

generationWorker.on("completed", (job) => {
  console.log("Generation job completed", job.id);
  generationWorker.close();
});
generationWorker.on("failed", (job, err) => {
  console.log("Generation job failed", job.id, err.message);
});

process.on("SIGINT", async () => {
  console.log("Closing the generation queue");
  await Promish.all([closeGenerationQueue(), generationWorker.close()]);
});
