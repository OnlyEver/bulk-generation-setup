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
  // const cleanUp = await cleanUpBatchData({
  //   batch_id: parsedResponses.batch_id,
  //   requestIdentifiers: parsedResponses.parsed_response.map(
  //     (e: ParsedResponse) => cleanRequestsIdentifier(e.requestIdentifier)
  //   ),
  // });
  return {
    status: "Success",
  };
};

export const populateQueueForNextRequest = async (
  sourceId: string,
  viewTimeThreshold?: number
) => {
  const data = await populateQueue(sourceId, viewTimeThreshold ?? 3000);
  return {
    status: "Success",
  };
};

(async () => {
  setUpMongoClient(config.dbUri, config.dbName ?? "");
  openai(config.openAiKey ?? "");
  // const db = getDbInstance();

  const created: any = await prepareGenerationBatch();
  const batch = await createBatchRequest(created.inputFileList);
  console.log(batch);
  const status = await checkBatchStatus(batch[0].id);

  // const status = await checkBatchStatus('batch_67ab0f7f19cc819081ea4b32717c1eb4');

  // console.log(status);
  // const file = await getResult(status.output_file_id ?? '');
  // console.log(file);


  // if (status.status === 'completed') {
  //   const parsedData = await parseDepth({
  //     rawResponse: {
  //       batch_id: status.id,
  //       request_id: {
  //         request_type: {
  //           type: "depth",
  //           n: 1,
  //         },
  //         _source: '',
  //         params: '',
  //       },
  //       response: file[0],
  //     },
  //     sourceTaxonomy: {},
  //   });
  //   var parsed = await (file);
  //   await bulkWriteToDb({
  //     batch_id: status.id,
  //     parsed_response: [parsedData],
  //   });
  //   console.log(file);
  // }
  // const result = await getResult(status.files[0].id);
  // const file = await populateQueueForNextRequest("6753b20fb3139953f3145df6");
  // console.log(file);

  // const parsedResponses = await db
  //   .collection("_parsed_response")
  //   .find({})
  //   .toArray();
  // const parsedIds = [];
  // const genReqs = db.collection("_generation_requests");
  // for (const response of parsedResponses) {
  //   const identifier = response.requestIdentifier;
  //   const parsedIdentifier = cleanRequestsIdentifier(identifier);
  //   if (parsedIdentifier) {
  //     parsedIds.push(parsedIdentifier);
  //   }
  // }

  // const req = await genReqs.find({ $or: parsedIds }).toArray();
  // console.log(req?.length);

  // await populateQueueForNextRequest("6753b20fb3139953f3145df6");
  // const files = await prepareGenerationBatch();
  // const batchData = await createBatchRequest(files as []);
  // console.log(batchData);

  // const data = await parseGeneratedData([getCardData()]);
  // console.log(data);
  // const dbOpes = await bulkWriteToDb(data);
  // console.log(dbOpes);
})();

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
