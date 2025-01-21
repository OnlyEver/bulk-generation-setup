import OpenAI from "openai";
import { config } from "../../config";
import { openAI } from "../../openai/openai_helper";
import { getDbInstance } from "../../app";

export async function checkBatchStatus(batchId: string) {
  try {
    // const bacthList = await openAI().batches.list();
    const batch = await openAI().batches.retrieve(batchId);
    const database = getDbInstance();
    const collection = database.collection("_batch_data");
    await collection.updateOne(
      { id: batchId },
      { $set: batch },
      { upsert: true }
    );
    return batch;
  } catch (e: any) {
    throw Error(e.message);
  }
}
