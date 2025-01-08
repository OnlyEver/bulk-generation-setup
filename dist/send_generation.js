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
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const create_batch_1 = require("./create_batch");
const check_batch_status_1 = require("./check_batch_status");
const typology_prompt_1 = require("./prompts/typology_prompt");
const parse_source_content_1 = require("./parse_source_content");
const config_1 = require("./config");
const delay_helper_1 = require("./helper_function/delay_helper");
const cancel_batch_1 = require("./cancel_batch");
const connection_1 = require("./mongodb/connection");
const get_result_1 = require("./get_result");
function sendGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        let docs = yield connection_1.sourceCollection.find({}).toArray();
        const customId = (doc) => {
            return JSON.stringify({
                'id': doc._id.toString(),
                'type': 'typology',
                'bloom_level': 1,
            });
        };
        const batchData = docs.map((doc, index) => ({
            custom_id: customId(doc), // Unique identifier for each request.
            method: "POST", // HTTP method.
            url: "/v1/chat/completions", // API endpoint.
            body: {
                model: "gpt-4o-mini",
                response_format: { type: 'json_object' }, // Specify the model.
                messages: [
                    { role: "system", content: (0, typology_prompt_1.returnTypologyPrompt)() }, // System message.
                    {
                        role: "user",
                        content: (0, parse_source_content_1.parseData)(doc.content, [
                            "See also",
                            "References",
                            "Further reading",
                            "External links",
                            "Notes and references",
                            "Bibliography",
                            "Notes",
                            "Cited sources",
                        ], ["table", "empty_line"]),
                    }, // User message (use doc content or default).
                ],
            },
        }));
        // Write the batch data to a local file
        const filePath = "./batchinputonl";
        yield promises_1.default.writeFile(filePath, batchData.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        const file = yield openai.files.create({
            file: fs_1.default.createReadStream("./batchinputonl"),
            purpose: "batch",
        });
        yield (0, create_batch_1.prepareBatch)(file.id);
        const batchStatus = yield poolBatchStatus('batch_677e2d19065081909e98849d40dd11ed');
        if (batchStatus.status == 'completed') {
            //get results
        }
        else {
            //handle failure
        }
        const fileData = yield (0, get_result_1.getResult)(batchStatus.file);
        return fileData;
        // const data = {
        //   generation: "Generation will be handled here",
        // };
        // return data;
    });
}
function poolBatchStatus(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const batchStatus = yield (0, check_batch_status_1.checkBatchStatus)(batchId);
        console.log('pooling');
        if (batchStatus.status == 'failed') {
            //cancel batch
            yield (0, cancel_batch_1.cancelBatch)(batchId);
            return {
                id: batchStatus.id,
                status: 'failed',
                file: batchStatus.error_file_id
            };
        }
        else if (batchStatus.status != 'completed') {
            yield (0, delay_helper_1.delay)(10);
            return yield poolBatchStatus(batchId);
        }
        else if (batchStatus.status == 'completed') {
            return {
                id: batchStatus.id,
                status: 'completed',
                file: batchStatus.output_file_id
            };
        }
        else {
            return {
                id: 'sda',
                status: 'failed',
            };
        }
    });
}
