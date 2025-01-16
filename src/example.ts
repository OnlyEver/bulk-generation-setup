import { setUpMongoClient, openai, prepareGenerationBatch, createBatchRequest, getDbInstance } from "./app";
import { config } from "./config";

(async () => {
    console.log('example');
    setUpMongoClient(config.dbUri, config.dbName ?? '');
    openai(config.openAiKey ?? '');
    const prepareResponse: any = await prepareGenerationBatch();
    const sourcesOnBatch = prepareResponse.sources;
    const batch = await createBatchRequest(prepareResponse.inputFileList);
    const batchDataCollection = getDbInstance().collection('_batch_data');
    const generationDataCollection = getDbInstance().collection('_generation_data');

    await batchDataCollection.insertMany(batch);

    await Promise.all(
        sourcesOnBatch.map(async (source: any) => {
            const status = batch[0].status ?? 'initialized'; // Defaults to null if the array is empty

            await generationDataCollection.updateMany({ _source: source._source }, { $set: { status: status } });
        })
    );

    //update generation data source with the status
    console.log(batch);

    //store batch to mongo
})();

