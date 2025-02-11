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
const populate_queue_1 = require("./generation-jobs/8.queue-next-request/populate_queue");
<<<<<<< Updated upstream
=======
const config_1 = require("./config");
const identifier_for_clearing_requests_1 = require("./utils/identifier_for_clearing_requests");
>>>>>>> Stashed changes
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
const prepareGenerationBatch = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, prepare_batch_1.prepareBatch)();
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
    // const cleanUp = await cleanUpBatchData({
    //   batch_id: parsedResponses.batch_id,
    //   requestIdentifiers: parsedResponses.parsed_response.map(
    //     (e: ParsedResponse) => cleanRequestsIdentifier(e.requestIdentifier)
    //   ),
    // });
    return {
        status: "Success",
    };
});
exports.bulkWriteToDb = bulkWriteToDb;
const populateQueueForNextRequest = (sourceId, viewTimeThreshold) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, populate_queue_1.populateQueue)(sourceId, viewTimeThreshold !== null && viewTimeThreshold !== void 0 ? viewTimeThreshold : 3000);
    return {
        status: "Success",
    };
});
exports.populateQueueForNextRequest = populateQueueForNextRequest;
<<<<<<< Updated upstream
// (async () => {
//   setUpMongoClient(config.dbUri, config.dbName ?? "");
//   await populateQueueForNextRequest("6753b20fb3139953f3145df6");
//   // const files = await prepareGenerationBatch();
//   // const batchData = await createBatchRequest(files as []);
//   // console.log(batchData);
//   // const data = await parseGeneratedData([getCardData()]);
//   // console.log(data);
//   // const dbOpes = await bulkWriteToDb(data);
//   // console.log(dbOpes);
// })();
=======
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, exports.setUpMongoClient)(config_1.config.dbUri, (_a = config_1.config.dbName) !== null && _a !== void 0 ? _a : "");
    (0, exports.openai)((_b = config_1.config.openAiKey) !== null && _b !== void 0 ? _b : "");
    // const db = getDbInstance();
    const created = yield (0, exports.prepareGenerationBatch)('o3-mini');
    const batch = yield (0, exports.createBatchRequest)(created.inputFileList);
    console.log(batch);
    const status = yield (0, check_batch_status_1.checkBatchStatus)(batch[0].id);
    // const status = await checkBatchStatus('batch_67ab0f7f19cc819081ea4b32717c1eb4');
    // console.log(status);
    // const file = await getResult(status.output_file_id ?? '');
    // console.log(file);
    // if (status.status === 'completed') {
    //   const parsedData = await parseDepth({
    //     rawResponse: {
    //       batch_id: status.id,
    //       request_id: {
    //         request_type: {
    //           type: "depth",
    //           n: 1,
    //         },
    //         _source: '',
    //         params: '',
    //       },
    //       response: file[0],
    //     },
    //     sourceTaxonomy: {},
    //   });
    //   var parsed = await (file);
    //   await bulkWriteToDb({
    //     batch_id: status.id,
    //     parsed_response: [parsedData],
    //   });
    //   console.log(file);
    // }
    // const result = await getResult(status.files[0].id);
    // const file = await populateQueueForNextRequest("6753b20fb3139953f3145df6");
    // console.log(file);
    // const parsedResponses = await db
    //   .collection("_parsed_response")
    //   .find({})
    //   .toArray();
    // const parsedIds = [];
    // const genReqs = db.collection("_generation_requests");
    // for (const response of parsedResponses) {
    //   const identifier = response.requestIdentifier;
    //   const parsedIdentifier = cleanRequestsIdentifier(identifier);
    //   if (parsedIdentifier) {
    //     parsedIds.push(parsedIdentifier);
    //   }
    // }
    // const req = await genReqs.find({ $or: parsedIds }).toArray();
    // console.log(req?.length);
    // await populateQueueForNextRequest("6753b20fb3139953f3145df6");
    // const files = await prepareGenerationBatch();
    // const batchData = await createBatchRequest(files as []);
    // console.log(batchData);
    // const data = await parseGeneratedData([getCardData()]);
    // console.log(data);
    // const dbOpes = await bulkWriteToDb(data);
    // console.log(dbOpes);
}))();
>>>>>>> Stashed changes
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