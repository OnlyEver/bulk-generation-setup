import OpenAI from "openai";
import { config } from "./config";

export async function prepareBatch(fileid: string) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const batch = await openai.batches.create({
    input_file_id: fileid,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
  });

  return batch;
}
