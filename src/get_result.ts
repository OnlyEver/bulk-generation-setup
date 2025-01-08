import OpenAI from "openai";
import { config } from "./config";

export async function getResult(fileid: string) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const fileResponse = await openai.files.content(fileid);
  const fileContents = await fileResponse.text();

  console.log(fileContents);
  return "Batch will be prepared here";
}
