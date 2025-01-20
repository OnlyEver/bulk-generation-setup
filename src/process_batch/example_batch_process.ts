/// This will be 2nd lamda function that pools the status objects on atlas , and parse the data if needed.
/// This probably will trigger the step function that will parse individual batches.

/// this function works on two parts
// 1. The main Lambda reads batch IDs from MongoDB.
// 2. Divides the IDs into manageable chunks. ( for now 5 batches per child)
// 3. Spawns child Lambdas asynchronously for each chunk.
// 4. Child Lambdas process the batches.

import { config } from "../config";
import { setUpMongoClient, openai, getDbInstance } from "../app";

import AWS from "aws-sdk";

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
  console.log("batch process");
  setUpMongoClient(config.dbUri, config.dbName ?? "");
  openai(config.openAiKey ?? "");
  await handler();

  // get batch status from mongo;
})();
