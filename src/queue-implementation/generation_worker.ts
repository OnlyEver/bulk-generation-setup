import { Worker } from "bullmq";
import { generationProcess } from "./generation-process.js";

export const generationWorker = new Worker(
  "generation-queue",
  async (job) => {
    console.log("Generation job started", job.id);
    await generationProcess(job);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
