import OpenAI from "openai";
import { config } from "../../config";
import { Batch } from "openai/resources";

export async function prepareBatch(fileId: string): Promise<Batch> {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const batch = await openai.batches.create({
    input_file_id: fileId,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
  });

  return batch;
}
