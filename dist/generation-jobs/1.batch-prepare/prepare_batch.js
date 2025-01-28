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
            var inputFileList = [];
            const generationDataCollection = connection_1.database.collection("_generation_requests");
            let docs = yield generationDataCollection
                .find({ status: "created" })
                .toArray();
            let sources = yield fetchSourceDocuments(docs);
            const result = [];
            for (let i = 0; i < sources.length; i += 300) {
                // Slice the array into chunks of maxCount elements
                result.push(sources.slice(i, i + 300));
            }
            yield Promise.all(result.map((element, index) => __awaiter(this, void 0, void 0, function* () {
                const batchDataList = [];
                yield Promise.all(element.map((elem) => __awaiter(this, void 0, void 0, function* () {
                    if (elem.request_type.type === "breadth") {
                        const batchData = yield prepareBatchForBreadth(elem);
                        batchDataList.push(batchData);
                    }
                    else {
                        const batchData = yield prepareBatchForDepth(elem);
                        batchDataList.push(batchData);
                    }
                })));
                const filePath = `/tmp/batchinput${index}.jsonl`;
                yield promises_1.default.writeFile(filePath, batchDataList.map((entry) => JSON.stringify(entry)).join("\n"), "utf-8");
                inputFileList.push(filePath);
            })));
            return {
                sources,
                inputFileList,
            };
            return inputFileList;
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
        case "breadth":
            return yield (0, fetch_typology_prompt_1.returnTypologyPrompt)();
        case "depth":
            return yield (0, fetch_card_gen_prompt_1.returnCardGenPrompt)(bloomLevel !== null && bloomLevel !== void 0 ? bloomLevel : 1);
        default:
            return yield (0, fetch_typology_prompt_1.returnTypologyPrompt)();
    }
});
const getCustomIdForBreadth = (doc) => {
    return {
        _source: doc.source._id.toString(),
        request_type: {
            type: doc.request_type.type,
            n: doc.request_type.n | 1,
        },
    };
};
const getCustomIdForDepth = (doc) => {
    return {
        _source: doc.source._id.toString(),
        request_type: {
            type: doc.request_type.type,
            n: doc.n | 1,
            bloom_level: doc.request_type.bloom_level,
        },
    };
};
const prepareBatchForBreadth = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompts = yield getPrompt(doc.request_type.type);
    const currentN = (_a = doc.request_type.n) !== null && _a !== void 0 ? _a : 1;
    let existingTypology = "";
    if (currentN > 1) {
        existingTypology =
            "Dont generate Existing taxonomy data is as " +
                JSON.stringify((_c = (_b = doc.source) === null || _b === void 0 ? void 0 : _b.source_taxonomy) !== null && _c !== void 0 ? _c : {});
    }
    return {
        custom_id: JSON.stringify(getCustomIdForBreadth(doc)), // Unique identifier for each request.
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
                    ], ["table", "empty_line"]) + existingTypology,
                },
            ],
        },
    };
});
const prepareBatchForDepth = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedTypology = doc.source.source_taxonomy;
    const params = doc.params;
    const cardGenPrompt = yield getPrompt(doc.request_type.type, doc.request_type.bloom_level);
    if (doc.request_type.bloom_level !== 1) {
        if (params) {
            if (params.missing_facts) {
                parsedTypology.facts = params.missing_facts;
            }
            if (params.missing_concepts) {
                parsedTypology.concepts = params.missing_concepts;
            }
        }
    }
    return {
        custom_id: JSON.stringify(getCustomIdForDepth(doc)),
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
const fetchSourceDocuments = (docs) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceCollection = connection_1.database.collection("_source");
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
//# sourceMappingURL=prepare_batch.js.map