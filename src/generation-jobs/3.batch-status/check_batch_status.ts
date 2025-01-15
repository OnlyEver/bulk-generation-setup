import OpenAI from "openai";
import { config } from "../../config";
import { openAI } from "../../openai/openai_helper";

export async function checkBatchStatus(batchId: string) {


  const batch = await openAI().batches.retrieve(batchId);
  return batch;
}
