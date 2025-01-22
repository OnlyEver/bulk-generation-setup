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
} from "../app";

import AWS from "aws-sdk";
import { parseDepth } from "../generation-jobs/5.batch-parse/parse_depth";
import { ObjectId } from "mongodb";
import { populateQueue } from "../generation-jobs/8.queue-next-request/populate_queue";

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
  // const fileContent = await getFileContent("file-AHL1qcGLCbTxA1Cc4ec7wm");
  // console.log(fileContent);

  const batchStatus = await getBatchStatus(
    "batch_678f656b08d88190ae11a7f7573517a1"
  );
  console.log(batchStatus.status);

  if (batchStatus.status === "completed") {
    const fileContent = await getFileContent(batchStatus.output_file_id ?? "");

    const parsedData = await parseGeneratedData(fileContent);

    const bulkWriteResult = await bulkWriteToDb(parsedData);
  } else if (batchStatus.status === "failed") {
    console.log("Batch failed");
    const errorFileContent = await getFileContent(
      batchStatus.error_file_id ?? ""
    );
  }

  //await populateQueue('6753b17a7d070c44ecf24f9e');
})();
