import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";
import { createBatch } from "./generation-jobs/2.batch-creation/create_batch";
import { prepareBatch } from "./generation-jobs/1.batch-prepare/prepare_batch";
import { database } from "./mongodb/connection";

// Connect to mongodb

export const dbInstance = (connectionUri: string) => {
  return database;
};

// This function prepares the batch for the Breadth generation, basically typology or concept/gap fills for the sources
export const prepareBatchForBreadth = async () => {
  const data = await prepareBatch();
  return data;
};

// This function prepares the batch for the depth generation, basically card generation
export const prepareBatchForDepth = async () => {
  const data = await prepareBatch();
  return data;
};

/// Creates an OPENAI batch request
/// After creation of the batch, the data is stored into mongodb
export const createBatchRequest = async (filePath: string) => {
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

/// parse taxonomy
