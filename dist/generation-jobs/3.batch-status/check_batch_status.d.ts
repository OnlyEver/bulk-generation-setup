import OpenAI from "openai";
export declare function checkBatchStatus(batchId: string): Promise<OpenAI.Batches.Batch & {
    _request_id?: string | null;
}>;
