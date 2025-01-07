
import OpenAI from "openai";
import { config } from "../config.js";


export async function prepareBatch(fileid) {
  const openai = new OpenAI({
    apiKey: config.openAiKey
  });
  const batch = await openai.batches.create({
    input_file_id: fileid,
    endpoint: "/v1/chat/completions",
    completion_window: "24h"
  });

  console.log(batch);
  return "Batch will be prepared here";
}
