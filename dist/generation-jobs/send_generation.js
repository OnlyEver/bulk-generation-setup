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
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const parse_source_content_1 = require("./1.batch-prepare/parse_source_content");
const config_1 = require("../config");
const delay_helper_1 = require("../utils/delay_helper");
const connection_1 = require("../mongodb/connection");
const create_batch_1 = require("./2.batch-creation/create_batch");
const get_result_1 = require("./4.batch-result/get_result");
const check_batch_status_1 = require("./3.batch-status/check_batch_status");
const cancel_batch_1 = require("./3.batch-status/cancel_batch");
const card_gen_prompt_1 = require("./1.batch-prepare/fetch-prompts/card_gen_prompt");
const mongodb_1 = require("mongodb");
const parse_typology_1 = require("../utils/parse_typology");
const card_gen_result_1 = require("./5.batch-parse/card_gen_result");
function sendGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        const batchStatus = yield poolBatchStatus('batch_6780a5c656f081909144eea4b5fea5b5');
        // console.log(batchStatus);
        if (batchStatus.status == "completed") {
            const generationContent = yield (0, get_result_1.getResult)(batchStatus.file);
            generationContent.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                const body = element['response']['body'];
                const content = body.choices[0]['message']['content'];
                const parsedContent = JSON.parse(content);
                console.log('Logging content');
                console.log(parsedContent['test_cards']);
                // parsedContent['test_cards'].forEach((e: Object) => {
                //   const parsedC = parseCardGenResponse(e, false, []);
                //   console.log(parsedC);
                // });
                const parsedC = (0, card_gen_result_1.parseCardGenResponse)(parsedContent, false, []);
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
                        yield insertCard(card, '');
                    })));
                }
            }));
            //get results
        }
        else {
            //handle failure
        }
        // let docs = await sourceCollection.find({}).toArray();
        // const customId = (doc: any, type: string) => {
        //   return JSON.stringify({
        //     id: doc._id.toString(),
        //     type: type,
        //     bloom_level: 1,
        //   });
        // };
        // const firstDoc = docs[0];
        // const batchData = [
        //   {
        //     custom_id: customId(firstDoc, "typology"), // Unique identifier for each request.
        //     method: "POST", // HTTP method.
        //     url: "/v1/chat/completions", // API endpoint.
        //     body: {
        //       model: "gpt-4o-mini",
        //       response_format: { type: "json_object" }, // Specify the model.
        //       messages: [
        //         { role: "system", content: returnTypologyPrompt() }, // System message.
        //         {
        //           role: "user",
        //           content: parseData(
        //             firstDoc.content,
        //             [
        //               "See also",
        //               "References",
        //               "Further reading",
        //               "External links",
        //               "Notes and references",
        //               "Bibliography",
        //               "Notes",
        //               "Cited sources",
        //             ],
        //             ["table", "empty_line"]
        //           ),
        //         }, // User message (use doc content or default).
        //       ],
        //     },
        //   }
        // ]
        // // const batchData = docs.map((doc, index) => ({
        // //   custom_id: customId(doc, "typology"), // Unique identifier for each request.
        // //   method: "POST", // HTTP method.
        // //   url: "/v1/chat/completions", // API endpoint.
        // //   body: {
        // //     model: "gpt-4o-mini",
        // //     response_format: { type: "json_object" }, // Specify the model.
        // //     messages: [
        // //       { role: "system", content: returnTypologyPrompt() }, // System message.
        // //       {
        // //         role: "user",
        // //         content: parseData(
        // //           doc.content,
        // //           [
        // //             "See also",
        // //             "References",
        // //             "Further reading",
        // //             "External links",
        // //             "Notes and references",
        // //             "Bibliography",
        // //             "Notes",
        // //             "Cited sources",
        // //           ],
        // //           ["table", "empty_line"]
        // //         ),
        // //       }, // User message (use doc content or default).
        // //     ],
        // //   },
        // // }));
        // // Write the batch data to a local file
        // const filePath = "./batchinputonl";
        // await fsPromise.writeFile(
        //   filePath,
        //   batchData.map((entry) => JSON.stringify(entry)).join("\n"),
        //   "utf-8"
        // );
        // const file = await openai.files.create({
        //   file: fs.createReadStream("./batchinputonl"),
        //   purpose: "batch",
        // });
        // const batch = await prepareBatch(file.id);
        // const batchStatus = await poolBatchStatus(
        //   batch.id
        // );
        // if (batchStatus.status == "completed") {
        // const cardGenResponse = await sendCardGeneration(respone, docs);
        //   //get results
        // } else {
        //   //handle failure
        // }
        // const fileData = await getResult(batchStatus.file!);
        // return fileData;
        // const respone = await getResult('file-AwS7kdAgAhczAKHSa5QobL');
        // const cardGenResponse = await sendCardGeneration(respone, docs);
        const data = {
            generation: "Generation will be handled here",
        };
        return data;
    });
}
function insertSourceTypology(parsedTypology, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inserting typology');
        console.log(parsedTypology);
        const doc = {
            _source_id: sourceId,
            typology: parsedTypology,
        };
        const result = yield connection_1.typologyCollection.insertOne(doc);
        console.log(result);
    });
}
function insertCard(parsedCardData, sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inserting card data');
        const doc = {
            _source_id: sourceId,
            content: parsedCardData.content,
            concepts: parsedCardData.concepts,
            facts: parsedCardData.facts,
            display_title: parsedCardData.displayTitle,
            bloom_level: parsedCardData.bloomlevel,
            heading: parsedCardData.heading,
        };
        const result = yield connection_1.cardCollection.insertOne(doc);
        console.log(result);
    });
}
function poolBatchStatus(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const batchStatus = yield (0, check_batch_status_1.checkBatchStatus)(batchId);
        console.log("pooling");
        if (batchStatus.status == "failed") {
            //cancel batch
            yield (0, cancel_batch_1.cancelBatch)(batchId);
            return {
                id: batchStatus.id,
                status: "failed",
                file: batchStatus.error_file_id,
            };
        }
        else if (batchStatus.status != "completed") {
            yield (0, delay_helper_1.delay)(10);
            return yield poolBatchStatus(batchId);
        }
        else if (batchStatus.status == "completed") {
            return {
                id: batchStatus.id,
                status: "completed",
                file: batchStatus.output_file_id,
            };
        }
        else {
            return {
                id: "sda",
                status: "failed",
            };
        }
    });
}
function sendCardGeneration(response, docs) {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        const cardGenBatchData = yield Promise.all(response.map((batchResponse) => __awaiter(this, void 0, void 0, function* () {
            const body = batchResponse['response']['body'];
            const content = body.choices[0]['message']['content'];
            const parsedContent = JSON.parse(content);
            // console.log(batchResponse);
            // console.log(parsedContent);
            const parsedTypology = (0, parse_typology_1.parseTypologyOnSuccess)(parsedContent);
            // console.log(parsedTypology);
            const customId = JSON.parse(batchResponse['custom_id']);
            const sourceId = customId['id'];
            yield insertSourceTypology(parsedTypology, sourceId);
            const sourceContent = docs.find((doc) => doc._id == sourceId);
            return {
                custom_id: JSON.stringify({
                    id: sourceId,
                    type: 'card_gen',
                    bloom_level: 1,
                }), // Unique identifier for each request.
                method: "POST", // HTTP method.
                url: "/v1/chat/completions", // API endpoint.
                body: {
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" }, // Specify the model.
                    messages: [
                        { role: "system", content: (0, card_gen_prompt_1.returnCardGenPrompt)() }, // System message.
                        {
                            role: "user",
                            content: JSON.stringify(parsedTypology) + (0, parse_source_content_1.parseData)(sourceContent.content, [
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
            };
        })));
        console.log(cardGenBatchData);
        // Write the batch data to a local file
        const cardGenFileData = "./batchinputForCardGen.jsonl";
        yield promises_1.default.writeFile(cardGenFileData, cardGenBatchData.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
        const file = yield openai.files.create({
            file: fs_1.default.createReadStream("./batchinputForCardGen.jsonl"),
            purpose: "batch",
        });
        var batch = yield (0, create_batch_1.prepareBatch)(file.id);
        // await checkBatchStatus(batch.id);
        const batchStatus = yield poolBatchStatus('batch_req_6780c0870f948190847abc0a5768750f');
        if (batchStatus.status == "completed") {
            const generationContent = yield (0, get_result_1.getResult)(batchStatus.file);
            console.log(generationContent);
            //get results
        }
        else {
            //handle failure
        }
    });
}
;
