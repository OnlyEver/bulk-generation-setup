import { setUpMongoClient, openai, prepareGenerationBatch, createBatchRequest } from "./app";
import { config } from "./config";

(async () => {
    console.log('example');
    setUpMongoClient(config.dbUri, config.dbName ?? '');
    openai(config.openAiKey ?? '');
    const filePath = await prepareGenerationBatch();
    console.log(filePath);
    // const batch = await createBatchRequest(filePath);
    // console.log(batch);

    //store batch to mongo
})();

