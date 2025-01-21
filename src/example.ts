import {
  createBatchRequest,
  getDbInstance,
  openai,
  prepareGenerationBatch,
  setUpMongoClient,
} from "./app";

/// setting up mongo
import { config } from "./config";

(async () => {
  try {
    //env variables
    const dbUri = config.dbUri;
    const dbName = config.dbName;
    const openAiKey = config.openAiKey;

    //setup mongodb connection
    setUpMongoClient(dbUri, dbName ?? "");

    //setup openAI
    openai(openAiKey ?? "");

    //prepare batch
    const prepareResponse: any = await prepareGenerationBatch();
    const sourcesOnBatch = prepareResponse.sources;

    //create batch
    const batch = await createBatchRequest(prepareResponse.inputFileList);
    const batchDataCollection = getDbInstance().collection("_batch_data");
    const generationDataCollection = getDbInstance().collection(
      "_generation_requests"
    );

    //store batch data in collection
    await batchDataCollection.insertMany(batch);

    //update generation data collection source batch status
    await Promise.all(
      sourcesOnBatch.map(async (source: any) => {
        const status = batch[0].status ?? "initialized"; // Defaults to null if the array is empty

        await generationDataCollection.updateMany(
          { _source: source._source },
          { $set: { status: status } }
        );
      })
    );
    console.log(batch);
  } catch (e: any) {
    throw e;
  }
})();
