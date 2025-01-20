"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
/// setting up mongo
const config_1 = require("./config");
(() => __awaiter(void 0, void 0, void 0, function* () {
    //env variables
    const dbUri = config_1.config.dbUri;
    const dbName = config_1.config.dbName;
    const openAiKey = config_1.config.openAiKey;
    //setup mongodb connection
    (0, app_1.setUpMongoClient)(dbUri, dbName !== null && dbName !== void 0 ? dbName : '');
    //setup openAI
    (0, app_1.openai)(openAiKey !== null && openAiKey !== void 0 ? openAiKey : '');
    //prepare batch
    const prepareResponse = yield (0, app_1.prepareGenerationBatch)();
    const sourcesOnBatch = prepareResponse.sources;
    //create batch
    const batch = yield (0, app_1.createBatchRequest)(prepareResponse.inputFileList);
    const batchDataCollection = (0, app_1.getDbInstance)().collection('_batch_data');
    const generationDataCollection = (0, app_1.getDbInstance)().collection('_generation_data');
    //store batch data in collection
    yield batchDataCollection.insertMany(batch);
    //update generation data collection source batch status
    yield Promise.all(sourcesOnBatch.map((source) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const status = (_a = batch[0].status) !== null && _a !== void 0 ? _a : 'initialized'; // Defaults to null if the array is empty
        yield generationDataCollection.updateMany({ _source: source._source }, { $set: { status: status } });
    })));
    console.log(batch);
}))();
//# sourceMappingURL=example.js.map