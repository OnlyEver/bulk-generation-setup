import {
  setUpMongoClient,
  openai,
  getDbInstance,
  getBatchStatus,
  getFileContent,
} from "../app";
import { config } from "../config";

// Child Lambda for processing batches
export const batchesHandler = async (event: any) => {
  setUpMongoClient(config.dbUri, config.dbName ?? "");
  openai(config.openAiKey ?? "");
  const db = getDbInstance();

  for (const batchId of event.batchIds) {
    await processBatch(batchId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Batch processing complete." }),
  };
};

async function processBatch(batchId: string) {
  console.log(`Processing batch ID: ${batchId}`);
  const batchStatus = await getBatchStatus(batchId);

  if (batchStatus.status === "completed") {
    const parsedData = await getFileContent(batchStatus.output_file_id ?? "");

    console.log(`Batch ID ${batchId} processed successfully.`);
  } else if (batchStatus.status === "failed") {
    const failureData = await getFileContent(batchStatus.error_file_id ?? "");
  } else {
    console.log(`Batch ID ${batchId} is not yet complete.`);
  }
}
