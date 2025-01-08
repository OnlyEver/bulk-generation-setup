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
const prepare_batch_1 = require("./prepare_batch");
const mongodb_1 = require("mongodb");
const typology_prompt_1 = require("./prompts/typology_prompt");
const parse_source_content_1 = require("./parse_source_content");
const config_1 = require("./config");
function sendGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbName = "onlyever";
        const db_uri = "mongodb://localhost:27017";
        const client = new mongodb_1.MongoClient(db_uri);
        const database = client.db(dbName);
        const collection = database.collection("_source");
        let docs = yield collection.find({}).toArray();
        let fields = [
            "Sciences",
            "Technology & Engineering",
            "Humanities & Cultural Studies",
            "Social Sciences & Global Studies",
            "Business & Management",
            "Health & Medicine",
            "Environmental Studies & Earth Sciences",
            "Education, Learning & Personal Development",
            "Creative & Performing Arts",
            "Law, Governance & Ethics",
            "Recreation, Lifestyle & Practical Skills",
            "Technology & Media Literacy",
            "Philosophy & Critical Thinking",
            "Space & Astronomical Sciences",
            "Agriculture & Food Sciences",
            "Trades & Craftsmanship",
            "Reference & Indexing",
            "Other",
        ];
        const batchData = docs.map((doc, index) => ({
            custom_id: `request-${index + 1}`, // Unique identifier for each request.
            method: "POST", // HTTP method.
            url: "/v1/chat/completions", // API endpoint.
            body: {
                model: "gpt-4o-mini", // Specify the model.
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
        yield (0, prepare_batch_1.prepareBatch)(file.id);
        const data = {
            generation: "Generation will be handled here",
        };
        return data;
    });
}
// const batchData = [
//   {
//     custom_id: "request-1",  // A unique identifier for this specific request in the batch
//     method: "POST",  // HTTP method
//     url: "/v1/chat/completions",  // The endpoint for the OpenAI API to request chat completions
//     body: {  // The payload (data) for the API request
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },  // A system message that sets the behavior of the assistant
//         { role: "user", content: "Hello world!" },  // The user's message, initiating the conversation
//       ],
//       max_tokens: 1000,  // The maximum number of tokens (words, phrases) the model is allowed to generate in response
//     },
//   },
//   {
//     custom_id: "request-2",
//     method: "POST",
//     url: "/v1/chat/completions",
//     body: {
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an unhelpful assistant." },
//         { role: "user", content: "Hello world!" },
//       ],
//       max_tokens: 1000,
//     },
//   },
// ];
