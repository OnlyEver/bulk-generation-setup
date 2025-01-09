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
exports.createBatch = createBatch;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
/**
 * Creates a batch using the provided input file for OpenAI's batch API.
 * Uploads the input file and creates a batch.
 *
 * @async
 * @returns {Promise<Batch>} - The batch object created by the OpenAI API.
 * @throws {Error} - Throws an error if file upload or batch creation fails.
 *
 */
function createBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const openai = new openai_1.default({
                apiKey: config_1.config.openAiKey,
            });
            const file = yield openai.files.create({
                file: fs_1.default.createReadStream("./batchinputonl"),
                purpose: "batch",
            });
            const batch = yield openai.batches.create({
                input_file_id: file.id,
                endpoint: "/v1/chat/completions",
                completion_window: "24h",
            });
            return batch;
        }
        catch (error) {
            console.error("Error during batch creation:", error);
            throw new Error(`Batch creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
