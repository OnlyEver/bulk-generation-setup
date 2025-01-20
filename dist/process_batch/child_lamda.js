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
exports.batchesHandler = void 0;
const app_1 = require("../app");
const config_1 = require("../config");
// Child Lambda for processing batches
const batchesHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, app_1.setUpMongoClient)(config_1.config.dbUri, (_a = config_1.config.dbName) !== null && _a !== void 0 ? _a : "");
    (0, app_1.openai)((_b = config_1.config.openAiKey) !== null && _b !== void 0 ? _b : "");
    const db = (0, app_1.getDbInstance)();
    for (const batchId of event.batchIds) {
        yield processBatch(batchId);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Batch processing complete." }),
    };
});
exports.batchesHandler = batchesHandler;
function processBatch(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log(`Processing batch ID: ${batchId}`);
        const batchStatus = yield (0, app_1.getBatchStatus)(batchId);
        if (batchStatus.status === "completed") {
            const parsedData = yield (0, app_1.getFileContent)((_a = batchStatus.output_file_id) !== null && _a !== void 0 ? _a : "");
            console.log(`Batch ID ${batchId} processed successfully.`);
        }
        else if (batchStatus.status === "failed") {
            const failureData = yield (0, app_1.getFileContent)((_b = batchStatus.error_file_id) !== null && _b !== void 0 ? _b : "");
        }
        else {
            console.log(`Batch ID ${batchId} is not yet complete.`);
        }
    });
}
