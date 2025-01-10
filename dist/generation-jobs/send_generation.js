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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGeneration = sendGeneration;
exports.sendCardGeneration = sendCardGeneration;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const delay_helper_1 = require("../utils/delay_helper");
const connection_1 = require("../mongodb/connection");
const get_result_1 = require("./4.batch-result/get_result");
const check_batch_status_1 = require("./3.batch-status/check_batch_status");
const mongodb_1 = require("mongodb");
const card_gen_result_1 = require("./5.batch-parse/card_gen_result");
const insert_1 = require("../mongodb/insert");
const prepare_batch_1 = require("./1.batch-prepare/prepare_batch");
const create_batch_1 = require("./2.batch-creation/create_batch");
const batch_status_1 = require("../enums/batch_status");
const prepare_card_batch_1 = require("./1.batch-prepare/prepare_card_batch");
function sendGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        // console.log("Batch id: ", batch.id);
        let docs = yield connection_1.sourceCollection.find({}).toArray();
        yield (0, prepare_batch_1.prepareBatch)();
        const batch = yield (0, create_batch_1.createBatch)('./batchinput.jsonl');
        const batchStatus = yield poolBatchStatus(batch.id);
        if (batchStatus.status == "completed") {
            const response = yield (0, get_result_1.getResult)(batchStatus.file);
            // const respone = await getResult('file-AwS7kdAgAhczAKHSa5QobL');
            yield sendCardGeneration(response, docs);
        }
        else {
            //handle failure
        }
        const data = {
            generation: "Generation will be handled here",
        };
        return data;
    });
}
function poolBatchStatus(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const batchStatus = yield (0, check_batch_status_1.checkBatchStatus)(batchId);
        console.log("pooling");
        console.log(batchId);
        if (batchStatus.status == batch_status_1.BatchStatusEnum.FAILED) {
            //cancel batch
            // await cancelBatch(batchId);
            return {
                id: batchStatus.id,
                status: batch_status_1.BatchStatusEnum.FAILED,
                file: batchStatus.error_file_id,
            };
        }
        else if (batchStatus.status != batch_status_1.BatchStatusEnum.COMPLETED) {
            yield (0, delay_helper_1.delay)(10);
            return yield poolBatchStatus(batchId);
        }
        else if (batchStatus.status == batch_status_1.BatchStatusEnum.COMPLETED) {
            return {
                id: batchStatus.id,
                status: batch_status_1.BatchStatusEnum.COMPLETED,
                file: batchStatus.output_file_id,
            };
        }
        else {
            return {
                id: "sda",
                status: batch_status_1.BatchStatusEnum.FAILED,
            };
        }
    });
}
function sendCardGeneration(response, docs) {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        const sourceId = yield (0, prepare_card_batch_1.prepareBatchForCard)(response, docs);
        var batch = yield (0, create_batch_1.createBatch)('./batchinputForCardGen.jsonl');
        const batchStatus = yield poolBatchStatus(batch.id);
        if (batchStatus.status == "completed") {
            const generationContent = yield (0, get_result_1.getResult)(batchStatus.file);
            console.log(generationContent);
            generationContent.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                const body = element['response']['body'];
                const content = body.choices[0]['message']['content'];
                const parsedContent = JSON.parse(content);
                console.log('Logging content');
                console.log(parsedContent['test_cards']);
                const source = docs.find((doc) => doc._id == sourceId);
                var headings = [];
                if (source) {
                    if (source.headings) {
                        headings = source.headings;
                    }
                }
                console.log(source);
                const parsedC = (0, card_gen_result_1.parseCardGenResponse)(parsedContent, false, headings);
                if (parsedC.cards_data != null) {
                    const cards = Array.from(parsedC.cards_data.entries()).map(([key, value]) => ({
                        id: new mongodb_1.ObjectId(key), // Convert the key to ObjectId
                        heading: value.heading,
                        content: value.content,
                        concepts: value.concepts,
                        facts: value.facts,
                        bloomlevel: value.bloomLevel,
                        displayTitle: value.displayTitle,
                    }));
                    yield Promise.all(cards.map((card) => __awaiter(this, void 0, void 0, function* () {
                        yield (0, insert_1.insertCard)(card, sourceId);
                    })));
                }
            }));
        }
        else {
            //handle failure
        }
    });
}
;
