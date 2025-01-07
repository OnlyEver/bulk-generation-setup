import OpenAI from "openai";
import { config } from "../config.js";



export async function checkBatchStatus(batchId) {

  const openai = new OpenAI({
    apiKey: config.openAiKey
  });

  const batch = await openai.batches.retrieve(batchId);
  return batch;
}
