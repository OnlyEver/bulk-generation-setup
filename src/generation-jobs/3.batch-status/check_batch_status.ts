import OpenAI from "openai";
import { config } from "../../config";

export async function checkBatchStatus(batchId: string) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });

  const batch = await openai.batches.retrieve(batchId);
  return batch;
}
