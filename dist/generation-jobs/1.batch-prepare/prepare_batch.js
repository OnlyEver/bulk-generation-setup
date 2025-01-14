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
const mongodb_1 = require("mongodb");
const card_gen_prompt_1 = require("./fetch-prompts/card_gen_prompt");
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
function prepareBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const generationDataCollection = connection_1.database.collection('_generation_data');
            let docs = yield generationDataCollection.find({}).toArray();
            let sources = yield fetchSourceDocuments(docs, connection_1.database);
            const customId = (doc) => {
                return JSON.stringify({
                    // id: doc._id.toString(),
                    id: doc.source._id.toString(),
                    // type: "typology",
                    type: doc.type,
                    bloom_level: 1,
                });
            };
            /// aasti ko json bata, which prompts to fetch evaluate, and get those prompts.
            const batchData = yield Promise.all(sources.map((doc) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    custom_id: customId(doc), // Unique identifier for each request.
                    method: "POST",
                    url: "/v1/chat/completions", // API endpoint.
                    body: {
                        model: "gpt-4o-mini",
                        response_format: { type: "json_object" },
                        messages: [
                            { role: "system", content: yield getPrompt(doc.type) },
                            {
                                role: "user",
                                content: (0, parse_source_content_1.parseData)(doc.source.content, [
                                    "See also",
                                    "References",
                                    "Further reading",
                                    "External links",
                                    "Notes and references",
                                    "Bibliography",
                                    "Notes",
                                    "Cited sources",
                                ], ["table", "empty_line"]),
                            },
                        ],
                    },
                });
            })));
            // Write the batch data to a local file
            const filePath = "./batchinput.jsonl";
            yield promises_1.default.writeFile(filePath, batchData.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
            return filePath;
        }
        catch (error) {
            console.error("Error occurred while preparing the batch file:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to prepare batch file: ${errorMessage}`);
        }
    });
}
const getPrompt = (type) => __awaiter(void 0, void 0, void 0, function* () {
    switch (type) {
        case "typology":
            return yield (0, typology_prompt_1.returnTypologyPrompt)();
        case "card":
            return (0, card_gen_prompt_1.returnCardGenPrompt)();
        default:
            return yield (0, typology_prompt_1.returnTypologyPrompt)();
    }
});
const prepareBatchForBreadth = () => __awaiter(void 0, void 0, void 0, function* () { });
const prepareBatchForDepth = () => __awaiter(void 0, void 0, void 0, function* () { });
const fetchSourceDocuments = (docs, db) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceCollection = db.collection('_source');
    const sourceDocs = yield Promise.all(docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
        const sourceId = doc._source;
        // Convert the string _source to ObjectId
        const sourceObjectId = mongodb_1.ObjectId.createFromHexString(sourceId);
        // Fetch the document from '_source' collection
        const source = yield sourceCollection.findOne({ _id: sourceObjectId });
        return Object.assign(Object.assign({}, doc), { source: source });
    })));
    return sourceDocs;
});
