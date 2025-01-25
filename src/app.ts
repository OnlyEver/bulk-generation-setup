import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";
import { createBatch } from "./generation-jobs/2.batch-creation/create_batch";
import { prepareBatch } from "./generation-jobs/1.batch-prepare/prepare_batch";
import { setUp, database } from "./mongodb/connection";
import OpenAI from "openai";
import { setOpenAIKey } from "./openai/openai_helper";
import { Db, MongoClient } from "mongodb";
import { parseBatchResponse } from "./generation-jobs/5.batch-parse/parse_batch";
import { handleBulkWrite } from "./generation-jobs/6.bulk-write-results/write_to_do";
import { cleanUpBatchData } from "./generation-jobs/7.clean-batch-data/clean_up_batch_data";
import { populateQueue } from "./generation-jobs/8.queue-next-request/populate_queue";
import { config } from "./config";

// Connect to mongodb
/// initializing the mongo client and open ai is absolutely necessary before proceeding anything

export const setUpMongoClient = (connectionUri: string, dbName: string) => {
  return setUp(connectionUri, dbName);
};

export const getDbInstance = (): Db => {
  return database;
};

// init openai
export const openai = (openaiKey: string) => {
  setOpenAIKey(openaiKey);
};

// This function prepares the batch for the Breadth generation, basically typology or concept/gap fills for the sources
export const prepareGenerationBatch = async () => {
  const data = await prepareBatch();
  return data;
};

// This function prepares the batch for the depth generation, basically card generation
// export const prepareBatchForDepth = async () => {
//   const data = await prepareBatch();
//   return data;
// };

/// Creates an OPENAI batch request
/// After creation of the batch, the data is stored into mongodb
export const createBatchRequest = async (filePath: string[]) => {
  const batchData = await createBatch(filePath);
  return batchData;
};

/// Gets batch status

export const getBatchStatus = async (batchId: string) => {
  const status = await checkBatchStatus(batchId);
  return status;
};

/// Get the file content provided a file id obtained from batch status,
export const getFileContent = async (fileId: string) => {
  const data = await getResult(fileId);
  return data;
};

export const parseGeneratedData = async (
  jsonLinesFromFile: any[]
): Promise<{
  batch_id: string;
  parsed_response: ParsedResponse[];
}> => {
  const data = await parseBatchResponse(jsonLinesFromFile);
  return data;
};

export const bulkWriteToDb = async (parsedResponses: {
  batch_id: string;
  parsed_response: ParsedResponse[];
}) => {
  const data = await handleBulkWrite(parsedResponses.parsed_response);
  const cleanUp = await cleanUpBatchData({
    batch_id: parsedResponses.batch_id,
    requestIdentifiers: parsedResponses.parsed_response.map(
      (e: ParsedResponse) => e.requestIdentifier
    ),
  });
  return {
    status: "Success",
  };
};

export const populateQueueForNextRequest = async (sourceId: string) => {
  const data = await populateQueue(sourceId);
  return {
    status: "Success",
  };
};
