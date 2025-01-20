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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
const connection_1 = require("./mongodb/connection");
(() => {
    var _a, _b;
    console.log("batch process");
    (0, app_1.setUpMongoClient)(config_1.config.dbUri, (_a = config_1.config.dbName) !== null && _a !== void 0 ? _a : "");
    (0, app_1.openai)((_b = config_1.config.openAiKey) !== null && _b !== void 0 ? _b : "");
    // get batch status from mongo;
})();
const dbInstance = connection_1.database;
const unresolvedBatchStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const batchStatusCollection = connection_1.database.collection("batch_status");
    const status = yield batchStatusCollection
        .find({ status: "in_progress" })
        .toArray();
});
