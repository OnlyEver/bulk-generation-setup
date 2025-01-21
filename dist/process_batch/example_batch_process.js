"use strict";
/// This will be 2nd lamda function that pools the status objects on atlas , and parse the data if needed.
/// This probably will trigger the step function that will parse individual batches.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/// this function works on two parts
// 1. The main Lambda reads batch IDs from MongoDB.
// 2. Divides the IDs into manageable chunks. ( for now 5 batches per child)
// 3. Spawns child Lambdas asynchronously for each chunk.
// 4. Child Lambdas process the batches.
const config_1 = require("../config");
const app_1 = require("../app");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const lambda = new aws_sdk_1.default.Lambda();
const CHILD_LAMBDA_NAME = "child-handler";
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, app_1.getDbInstance)();
    const collection = db.collection("_batch_data");
    const batchIds = yield collection
        .find({})
        .map((doc) => doc.id)
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
});
exports.handler = handler;
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // console.log("batch process");
    (0, app_1.setUpMongoClient)(config_1.config.dbUri, (_a = config_1.config.dbName) !== null && _a !== void 0 ? _a : "");
    (0, app_1.openai)((_b = config_1.config.openAiKey) !== null && _b !== void 0 ? _b : "");
    const batchStatus = yield (0, app_1.getBatchStatus)("batch_678f656b08d88190ae11a7f7573517a1");
    console.log(batchStatus.status);
    if (batchStatus.status === "completed") {
        const fileContent = yield (0, app_1.getFileContent)((_c = batchStatus.output_file_id) !== null && _c !== void 0 ? _c : "");
        const parsedData = yield (0, app_1.parseGeneratedData)(fileContent);
        const bulkWriteResult = yield (0, app_1.bulkWriteToDb)(parsedData);
    }
    else if (batchStatus.status === "failed") {
        console.log("Batch failed");
        const errorFileContent = yield (0, app_1.getFileContent)((_d = batchStatus.error_file_id) !== null && _d !== void 0 ? _d : "");
    }
    //await populateQueue('6753b17a7d070c44ecf24f9e');
}))();
//# sourceMappingURL=example_batch_process.js.map