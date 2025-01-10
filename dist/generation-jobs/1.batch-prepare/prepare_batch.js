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
exports.prepareBatch = prepareBatch;
const promises_1 = __importDefault(require("fs/promises"));
const connection_1 = require("../../mongodb/connection");
const typology_prompt_1 = require("../1.batch-prepare/fetch-prompts/typology_prompt");
const parse_source_content_1 = require("../1.batch-prepare/parse_source_content");
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
function prepareBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let docs = yield connection_1.sourceCollection.find({}).toArray();
            const customId = (doc) => {
                return JSON.stringify({
                    id: doc._id.toString(),
                    type: "typology",
                    bloom_level: 1,
                });
            };
            console.log(docs);
            const batchData = docs.map((doc, index) => ({
                custom_id: customId(doc), // Unique identifier for each request.
                method: "POST",
                url: "/v1/chat/completions", // API endpoint.
                body: {
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: (0, typology_prompt_1.returnTypologyPrompt)() },
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
            console.log(batchData);
            // Write the batch data to a local file
            const filePath = "./batchinput.jsonl";
            yield promises_1.default.writeFile(filePath, batchData.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
        }
        catch (error) {
            console.error("Error occurred while preparing the batch file:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to prepare batch file: ${errorMessage}`);
        }
    });
}
