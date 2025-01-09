import OpenAI from "openai";
import { config } from "../../config";

export async function cancelBatch(batchId: string) {
    const openai = new OpenAI({
        apiKey: config.openAiKey,
    });
    const batch = await openai.batches.cancel(batchId);


    return batch;
}
