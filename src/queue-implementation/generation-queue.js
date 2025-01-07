import { Queue } from "bullmq";

const generationQueue = new Queue("generation-queue", {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
});

export async function addGenerationTask(data) {
  const response = await generationQueue.add(`generation-${data.id}`, data);
  console.log("Generation task added", response.id);
}

export async function closeGenerationQueue() {
  await generationQueue.close();
}
