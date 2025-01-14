import OpenAI from "openai";
export declare const setUpMongoClient: (connectionUri: string, dbName: string) => void;
export declare const openai: (openaiKey: string) => void;
export declare const prepareBatchForBreadth: () => Promise<void>;
export declare const prepareBatchForDepth: () => Promise<void>;
export declare const createBatchRequest: (filePath: string) => Promise<OpenAI.Batches.Batch>;
export declare const getBatchStatus: (batchId: string) => Promise<OpenAI.Batches.Batch & {
    _request_id?: string | null;
}>;
export declare const getFileContent: (fileId: string) => Promise<any[]>;
