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
exports.populateQueueForNextRequest = exports.bulkWriteToDb = exports.parseGeneratedData = exports.getFileContent = exports.getBatchStatus = exports.createBatchRequest = exports.prepareGenerationBatch = exports.openai = exports.getDbInstance = exports.setUpMongoClient = void 0;
const check_batch_status_1 = require("./generation-jobs/3.batch-status/check_batch_status");
const get_result_1 = require("./generation-jobs/4.batch-result/get_result");
const create_batch_1 = require("./generation-jobs/2.batch-creation/create_batch");
const prepare_batch_1 = require("./generation-jobs/1.batch-prepare/prepare_batch");
const connection_1 = require("./mongodb/connection");
const openai_helper_1 = require("./openai/openai_helper");
const parse_batch_1 = require("./generation-jobs/5.batch-parse/parse_batch");
const write_to_do_1 = require("./generation-jobs/6.bulk-write-results/write_to_do");
const clean_up_batch_data_1 = require("./generation-jobs/7.clean-batch-data/clean_up_batch_data");
const populate_queue_1 = require("./generation-jobs/8.queue-next-request/populate_queue");
const identifier_for_clearing_requests_1 = require("./utils/identifier_for_clearing_requests");
// Connect to mongodb
/// initializing the mongo client and open ai is absolutely necessary before proceeding anything
const setUpMongoClient = (connectionUri, dbName) => {
    return (0, connection_1.setUp)(connectionUri, dbName);
};
exports.setUpMongoClient = setUpMongoClient;
const getDbInstance = () => {
    return connection_1.database;
};
exports.getDbInstance = getDbInstance;
// init openai
const openai = (openaiKey) => {
    (0, openai_helper_1.setOpenAIKey)(openaiKey);
};
exports.openai = openai;
// This function prepares the batch for the Breadth generation, basically typology or concept/gap fills for the sources
const prepareGenerationBatch = (model) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, prepare_batch_1.prepareBatch)(model !== null && model !== void 0 ? model : "gpt-4o-mini");
    return data;
});
exports.prepareGenerationBatch = prepareGenerationBatch;
// This function prepares the batch for the depth generation, basically card generation
// export const prepareBatchForDepth = async () => {
//   const data = await prepareBatch();
//   return data;
// };
/// Creates an OPENAI batch request
/// After creation of the batch, the data is stored into mongodb
const createBatchRequest = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const batchData = yield (0, create_batch_1.createBatch)(filePath);
    return batchData;
});
exports.createBatchRequest = createBatchRequest;
/// Gets batch status
const getBatchStatus = (batchId) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield (0, check_batch_status_1.checkBatchStatus)(batchId);
    return status;
});
exports.getBatchStatus = getBatchStatus;
/// Get the file content provided a file id obtained from batch status,
const getFileContent = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, get_result_1.getResult)(fileId);
    return data;
});
exports.getFileContent = getFileContent;
const parseGeneratedData = (jsonLinesFromFile) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, parse_batch_1.parseBatchResponse)(jsonLinesFromFile);
    return data;
});
exports.parseGeneratedData = parseGeneratedData;
const bulkWriteToDb = (parsedResponses) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, write_to_do_1.handleBulkWrite)(parsedResponses.parsed_response);
    const cleanUp = yield (0, clean_up_batch_data_1.cleanUpBatchData)({
        batch_id: parsedResponses.batch_id,
        requestIdentifiers: parsedResponses.parsed_response.map((e) => (0, identifier_for_clearing_requests_1.cleanRequestsIdentifier)(e.requestIdentifier)),
    });
    return {
        status: "Success",
    };
});
exports.bulkWriteToDb = bulkWriteToDb;
const populateQueueForNextRequest = (sourceId, viewTimeThreshold, generateBreadthOnly) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, populate_queue_1.populateQueue)(sourceId, viewTimeThreshold !== null && viewTimeThreshold !== void 0 ? viewTimeThreshold : 3000, generateBreadthOnly !== null && generateBreadthOnly !== void 0 ? generateBreadthOnly : false);
    return {
        status: "Success",
    };
});
exports.populateQueueForNextRequest = populateQueueForNextRequest;
// (async () => {
//   setUpMongoClient(config.dbUri, config.dbName ?? "");
//   openai(config.openAiKey ?? "");
//   var data = await getBatchStatus("batch_67f8d48f932c81908ffee9d88c7a0a76");
//   console.log(data);
// })();
//batch_67f8d48f26e48190b6067acfe86eb97c
//batch_67f8d48f26e48190b6067acfe86eb97c
//batch_67f8d48f932c81908ffee9d88c7a0a76
//batch_67f8d4ad2a1481908da99751950463eb
// (async () => {
//   setUpMongoClient(config.dbUri, config.dbName ?? "");
//   openai(config.openAiKey ?? "");
//   // const prepareResponse: any = await prepareGenerationBatch('o3-mini');
//   // const sourcesOnBatch = prepareResponse.sources;
//   // if (sourcesOnBatch.length === 0) {
//   //   console.log("No sources found on batch");
//   //   return;
//   // }
//   // //create batch
//   // const batch = await createBatchRequest(prepareResponse.inputFileList);
//   const batchStatus = await getBatchStatus('batch_67f789f953048190b169b6fe7e71f38f');
//   console.log(batchStatus);
//   // const app = express();
//   // const PORT = process.env.PORT || 3000;
//   // const batchData = await getBatchStatus("batch_67f629474c8c8190a2731c5838f92b6f");
//   const content = await getFileContent("file-8yapiBda8x1dQRMEVyFUvs");
//   console.log(content);
//   // const parsedData = await parseGeneratedData(content);
//   // console.log(parsedData);
//   // const dbOps = await convertParsedArrayToDbOperations(parsedData.parsed_response);
//   // console.log(content);
// })();
// Middleware to parse JSON bodies
// app.use(express.json());
// POST endpoint to populate queue
// app.get('/api/populate-queue', async () => {
//   try {
//     const result = await populateQueue('asds', 1, true);
//   } catch (error) {
//     console.error('Error populating queue:', error);
//   }
// });
// Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// function extractCustomId(customId: string): RequestId {
//   const customIdData = JSON.parse(customId);
//   let identifier: RequestId = {
//     _source: customIdData._source,
//     request_type: {
//       type: customIdData.request_type.type,
//       n: customIdData.request_type.n,
//     },
//   };
//   if (customIdData.request_type.bloom_level) {
//     identifier.request_type.bloom_level = customIdData.request_type.bloom_level;
//   }
//   return identifier;
// }
//# sourceMappingURL=app.js.map