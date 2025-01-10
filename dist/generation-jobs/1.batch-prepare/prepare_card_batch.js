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
exports.prepareBatchForCard = prepareBatchForCard;
const promises_1 = __importDefault(require("fs/promises"));
const parse_source_content_1 = require("../1.batch-prepare/parse_source_content");
const parse_typology_1 = require("../../utils/parse_typology");
const insert_1 = require("../../mongodb/insert");
const card_gen_prompt_1 = require("./fetch-prompts/card_gen_prompt");
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
function prepareBatchForCard(response, docs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var sourceId = '';
            const cardGenBatchData = yield Promise.all(response.map((batchResponse) => __awaiter(this, void 0, void 0, function* () {
                const body = batchResponse['response']['body'];
                const content = body.choices[0]['message']['content'];
                const parsedContent = JSON.parse(content);
                // console.log(batchResponse);
                // console.log(parsedContent);
                const parsedTypology = (0, parse_typology_1.parseTypologyOnSuccess)(parsedContent);
                // console.log(parsedTypology);
                const customId = JSON.parse(batchResponse['custom_id']);
                sourceId = customId['id'];
                yield (0, insert_1.insertSourceTypology)(parsedTypology, sourceId);
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
            const cardGenFileData = "./batchinputForCardGen.jsonl";
            yield promises_1.default.writeFile(cardGenFileData, cardGenBatchData.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
            return sourceId;
        }
        catch (error) {
            console.error("Error occurred while preparing the batch file:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to prepare batch file: ${errorMessage}`);
        }
    });
}
