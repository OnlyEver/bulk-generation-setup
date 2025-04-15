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
import { parseBreadth } from "./generation-jobs/5.batch-parse/parse_breadth";
import { parseDepth } from "./generation-jobs/5.batch-parse/parse_depth";
import { cleanRequestsIdentifier } from "./utils/identifier_for_clearing_requests";
import { getCardData } from "./generation-jobs/5.batch-parse/temp_card_gen_data";
import express from 'express';
import { convertParsedArrayToDbOperations } from "./generation-jobs/6.bulk-write-results/prepare-ops/parsed_response_to_db_operations";

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
export const prepareGenerationBatch = async (model: string | null) => {
  const data = await prepareBatch(model ?? "gpt-4o-mini");
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
      (e: ParsedResponse) => cleanRequestsIdentifier(e.requestIdentifier)
    ),
  });
  return {
    status: "Success",
  };
};

export const populateQueueForNextRequest = async (
  sourceId: string,
  viewTimeThreshold?: number,
  generateBreadthOnly?: boolean
) => {
  const data = await populateQueue(sourceId, viewTimeThreshold ?? 3000, generateBreadthOnly ?? false);
  return {
    status: "Success",
  };
};


(async () => {
  setUpMongoClient(config.dbUri, config.dbName ?? "");
  openai(config.openAiKey ?? "");
  var data = await getBatchStatus("batch_67f8d48f932c81908ffee9d88c7a0a76");
  console.log(data);
})();

//batch_67f8d48f26e48190b6067acfe86eb97c
//batch_67f8d48f26e48190b6067acfe86eb97c
//batch_67f8d48f932c81908ffee9d88c7a0a76
//batch_67f8d4ad2a1481908da99751950463eb
// (async () => {
//   setUpMongoClient(config.dbUri, config.dbName ?? "");
//   openai(config.openAiKey ?? "");
//   // const prepareResponse: any = await prepareGenerationBatch('o3-mini');
//   // const sourcesOnBatch = prepareResponse.sources;
//   // if (sourcesOnBatch.length === 0) {
//   //   console.log("No sources found on batch");
//   //   return;
//   // }

//   // //create batch
//   // const batch = await createBatchRequest(prepareResponse.inputFileList);
//   const batchStatus = await getBatchStatus('batch_67f789f953048190b169b6fe7e71f38f');
//   console.log(batchStatus);

//   // const app = express();
//   // const PORT = process.env.PORT || 3000;
//   // const batchData = await getBatchStatus("batch_67f629474c8c8190a2731c5838f92b6f");
//   const content = await getFileContent("file-8yapiBda8x1dQRMEVyFUvs");
//   console.log(content);
//   // const parsedData = await parseGeneratedData(content);
//   // console.log(parsedData);
//   // const dbOps = await convertParsedArrayToDbOperations(parsedData.parsed_response);

//   // console.log(content);
// })();



// Middleware to parse JSON bodies
// app.use(express.json());

// POST endpoint to populate queue
// app.get('/api/populate-queue', async () => {
//   try {
//     const result = await populateQueue('asds', 1, true);
//   } catch (error) {
//     console.error('Error populating queue:', error);
//   }
// });

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// function extractCustomId(customId: string): RequestId {
//   const customIdData = JSON.parse(customId);
//   let identifier: RequestId = {
//     _source: customIdData._source,
//     request_type: {
//       type: customIdData.request_type.type,
//       n: customIdData.request_type.n,
//     },
//   };
//   if (customIdData.request_type.bloom_level) {
//     identifier.request_type.bloom_level = customIdData.request_type.bloom_level;
//   }
//   return identifier;
// }
