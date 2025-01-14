import OpenAI from "openai";
import { config } from "../../config";
import { openAI } from "../../openai/openai_helper";

export async function cancelBatch(batchId: string) {

    const batch = await openAI().batches.cancel(batchId);


    return batch;
}

