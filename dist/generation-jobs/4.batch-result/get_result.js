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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResult = getResult;
const openai_helper_1 = require("../../openai/openai_helper");
function getResult(fileid) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileResponse = yield (0, openai_helper_1.openAI)().files.content(fileid);
        const fileContents = yield fileResponse.text();
        const parseJSONLs = _parseJsonlFile(fileContents.toString());
        return parseJSONLs;
        // return JSON.parse(pa);
    });
}
const _parseJsonlFile = (content) => {
    try {
        // Read the JSONL file content
        // const fileContent = await fs.readFile(content, "utf8");
        // Split the content into lines and parse each line as JSON
        const data = content
            .split("\n") // Split by newline character
            .filter((line) => line.trim() !== "") // Remove empty lines
            .map((line) => JSON.parse(line)); // Parse each line as JSON
        console.log("Parsed JSONL Data:", data);
        return data;
    }
    catch (error) {
        console.error("Error parsing JSONL file:", error);
        throw error;
    }
};
