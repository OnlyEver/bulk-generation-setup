/// This will be 2nd lamda function that pools the status objects on atlas , and parse the data if needed.
/// This probably will trigger the step function that will parse individual batches.

/// this function works on two parts
// 1. The main Lambda reads batch IDs from MongoDB.
// 2. Divides the IDs into manageable chunks. ( for now 5 batches per child)
// 3. Spawns child Lambdas asynchronously for each chunk.
// 4. Child Lambdas process the batches.

import { config } from "../config";
import {
  setUpMongoClient,
  openai,
  getDbInstance,
  getBatchStatus,
  getFileContent,
  parseGeneratedData,
  bulkWriteToDb,
  populateQueueForNextRequest,
} from "../app";

import AWS from "aws-sdk";
import { parseDepth } from "../generation-jobs/5.batch-parse/parse_depth";
import { ObjectId } from "mongodb";
import { populateQueue } from "../generation-jobs/8.queue-next-request/populate_queue";
import { cleanUpBatchData } from "../generation-jobs/7.clean-batch-data/clean_up_batch_data";

const lambda = new AWS.Lambda();

const CHILD_LAMBDA_NAME = "child-handler";

export const handler = async () => {
  const db = getDbInstance();
  const collection = db.collection("_batch_data");

  const batchIds = await collection
    .find({})
    .map((doc: any) => doc.id)
    .toArray();

  console.log(`Found ${batchIds.length} batch IDs to process.`);
  const MAX_BATCHES_PER_CHILD = 5;

  for (let i = 0; i < batchIds.length; i += MAX_BATCHES_PER_CHILD) {
    const batchChunk = batchIds.slice(i, i + MAX_BATCHES_PER_CHILD);
    /// actual lamda dekhi chai, yo lamda haru invoke hunca.
    // but for local development, aahaile lai child lamda function nai call garum.

    // await lambda
    //   .invoke({
    //     FunctionName: CHILD_LAMBDA_NAME!,
    //     InvocationType: "Event",
    //     Payload: JSON.stringify({ batchIds: batchChunk }),
    //   })
    //   .promise();

    console.log(`Invoked child Lambda for batch chunk: ${batchChunk}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Batch processing initiated.",
      totalBatches: batchIds.length,
    }),
  };
};
(async () => {
  // console.log("batch process");
  setUpMongoClient(config.dbUri, config.dbName ?? "");
  openai(config.openAiKey ?? "");
  // await cleanUpBatchData({
  //   batch_id: "batch_6792040ab01481909c1a1ca5d61c56a4",
  //   requestIdentifiers: [
  //     {
  //       _source: "6753b17a7d070c44ecf24f9e",
  //       request_type: {
  //         type: "breadth",
  //         n: 1,
  //       },
  //     },
  //   ],
  // });
  // const fileContent = await getFileContent("");
  // console.log(fileContent);

  // const batchStatus = await getBatchStatus(
  //   "batch_6792040ab01481909c1a1ca5d61c56a4"
  // );
  // console.log(batchStatus.status);

  // if (batchStatus.status === "completed") {
  //   const fileContent = await getFileContent(batchStatus.output_file_id ?? "");

  //   const parsedData = await parseGeneratedData(fileContent);
  //   const sourceIds = parsedData.parsed_response.map(
  //     (item) => item.requestIdentifier._source
  //   );
  //   const uniqueSourceIds = [...new Set(sourceIds)];

  //   const bulkWriteResult = await bulkWriteToDb(parsedData);
  //   uniqueSourceIds.forEach(async (sourceId) => {
  //     console.log(`Source ID: ${sourceId}`);
  await populateQueueForNextRequest("6753b17a7d070c44ecf24f9e");
  //   });
  // } else if (batchStatus.status === "failed") {
  //   console.log("Batch failed");
  //   const errorFileContent = await getFileContent(
  //     batchStatus.error_file_id ?? ""
  //   );
  // }

  //await populateQueue('6753b17a7d070c44ecf24f9e');
})();
