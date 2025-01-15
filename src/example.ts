import { setUpMongoClient, openai, prepareGenerationBatch, createBatchRequest, getDbInstance } from "./app";
import { config } from "./config";

(async () => {
    console.log('example');
    setUpMongoClient(config.dbUri, config.dbName ?? '');
    openai(config.openAiKey ?? '');
    const filePaths = await prepareGenerationBatch();
    console.log(filePaths);
    const batch = await createBatchRequest(filePaths);
    const batchDataCollection = getDbInstance().collection('_batch_data');
    // const batchData = {
    //     id: batch.id,
    //     input_file_id: batch.input_file_id,
    //     output_file_id: batch.output_file_id,
    //     error_file_id: batch.error_file_id,
    //     status: batch.status,
    //     ctime: Date.UTC,
    // }
    await batchDataCollection.insertMany(batch);

    //update generation data source with the status
    console.log(batch);
    // batch.id,
    // batch.input_file_id,
    // batch.status,
    // ctime,

    //store batch to mongo
})();

