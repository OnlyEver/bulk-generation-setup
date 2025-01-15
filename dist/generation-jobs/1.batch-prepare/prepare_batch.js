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
const fetch_typology_prompt_1 = require("./fetch-prompts/fetch_typology_prompt");
const parse_source_content_1 = require("../1.batch-prepare/parse_source_content");
const mongodb_1 = require("mongodb");
const fetch_card_gen_prompt_1 = require("./fetch-prompts/fetch_card_gen_prompt");
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
function prepareBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const generationDataCollection = connection_1.database.collection('_generation_data');
            let docs = yield generationDataCollection.find({}).toArray();
            let sources = yield fetchSourceDocuments(docs);
            const batchData = yield Promise.all(sources.map((doc) => __awaiter(this, void 0, void 0, function* () {
                if (doc.type == 'typology') {
                    return yield prepareBatchForBreadth(doc);
                }
                else {
                    return yield prepareBatchForDepth(doc);
                }
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
const getPrompt = (type, bloomLevel) => __awaiter(void 0, void 0, void 0, function* () {
    switch (type) {
        case "typology":
            return yield (0, fetch_typology_prompt_1.returnTypologyPrompt)();
        case "card":
            return yield (0, fetch_card_gen_prompt_1.returnCardGenPrompt)(bloomLevel !== null && bloomLevel !== void 0 ? bloomLevel : 1);
        default:
            return yield (0, fetch_typology_prompt_1.returnTypologyPrompt)();
    }
});
const getCustomIdForBreadth = (doc) => ({
    return: JSON.stringify({
        id: doc.source._id.toString(),
        type: doc.type,
        bloom_level: 1,
    })
});
const getCustomIdForDepth = (doc) => ({
    return: JSON.stringify({
        id: doc.index,
        type: doc.type,
        bloom_level: doc.bloom_level,
    })
});
const getBatchDataForBreadth = (content) => {
};
const getBatchDataForDepth = (content) => {
};
const prepareBatchForBreadth = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    const prompts = yield getPrompt(doc.type);
    return {
        custom_id: getCustomIdForBreadth(doc), // Unique identifier for each request.
        method: "POST",
        url: "/v1/chat/completions", // API endpoint.
        body: {
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: prompts },
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
    };
});
const prepareBatchForDepth = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedTypology = yield fetchTypologyDocuments(doc.source.id);
    const cardGenPrompt = yield getPrompt(doc.type, doc.bloom_level);
    return {
        custom_id: getCustomIdForDepth(doc),
        method: "POST", // HTTP method.
        url: "/v1/chat/completions", // API endpoint.
        body: {
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }, // Specify the model.
            messages: [
                { role: "system", content: cardGenPrompt }, // System message.
                {
                    role: "user",
                    content: JSON.stringify(parsedTypology) +
                        (0, parse_source_content_1.parseData)(doc.source.content, [
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
});
const fetchTypologyDocuments = (sourceId) => __awaiter(void 0, void 0, void 0, function* () {
    const typologyCollection = connection_1.database.collection('typology');
    const data = yield typologyCollection.findOne({ _source_id: sourceId.toString() }, { projection: { typology: 1, _id: 0, _source_id: 0 } });
    return {
        data
    };
});
const fetchSourceDocuments = (docs) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceCollection = connection_1.database.collection('_source');
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
