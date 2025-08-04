import OpenAI from "openai";
import { Db } from "mongodb";
export declare const setUpMongoClient: (connectionUri: string, dbName: string) => void;
export declare const getDbInstance: () => Db;
export declare const openai: (openaiKey: string) => void;
export declare const prepareGenerationBatch: (model: string | null) => Promise<{
    sources: any[];
    inputFileList: string[];
}>;
export declare const createBatchRequest: (filePath: string[]) => Promise<OpenAI.Batches.Batch[]>;
export declare const getBatchStatus: (batchId: string) => Promise<OpenAI.Batches.Batch & {
    _request_id?: string | null;
}>;
export declare const getFileContent: (fileId: string) => Promise<any[]>;
export declare const parseGeneratedData: (jsonLinesFromFile: any[]) => Promise<{
    batch_id: string;
    parsed_response: ParsedResponse[];
}>;
export declare const bulkWriteToDb: (parsedResponses: {
    batch_id: string;
    parsed_response: ParsedResponse[];
}) => Promise<{
    status: string;
}>;
export declare const populateQueueForNextRequest: (sourceId: string, viewTimeThreshold?: number, generateBreadthOnly?: boolean) => Promise<{
    status: string;
}>;
