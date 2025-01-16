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
const config_1 = require("./config");
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('example');
    (0, app_1.setUpMongoClient)(config_1.config.dbUri, (_a = config_1.config.dbName) !== null && _a !== void 0 ? _a : '');
    (0, app_1.openai)((_b = config_1.config.openAiKey) !== null && _b !== void 0 ? _b : '');
    const prepareResponse = yield (0, app_1.prepareGenerationBatch)();
    const sourcesOnBatch = prepareResponse.sources;
    const batch = yield (0, app_1.createBatchRequest)(prepareResponse.inputFileList);
    const batchDataCollection = (0, app_1.getDbInstance)().collection('_batch_data');
    const generationDataCollection = (0, app_1.getDbInstance)().collection('_generation_data');
    yield batchDataCollection.insertMany(batch);
    yield Promise.all(sourcesOnBatch.map((source) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const status = (_a = batch[0].status) !== null && _a !== void 0 ? _a : 'initialized'; // Defaults to null if the array is empty
        yield generationDataCollection.updateMany({ _source: source._source }, { $set: { status: status } });
    })));
    //update generation data source with the status
    console.log(batch);
    //store batch to mongo
}))();
