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
exports.getResult = getResult;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("./config");
function getResult(fileid) {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new openai_1.default({
            apiKey: config_1.config.openAiKey,
        });
        const fileResponse = yield openai.files.content(fileid);
        const fileContents = yield fileResponse.text();
        console.log(fileContents);
        const parsedString = parseJsonlFile(fileContents.toString());
        return parsedString;
        // return JSON.parse(pa);
    });
}
// const readJsonlFile = async (file:) => {
//   try {
//     // Read the entire JSONL file as a string
//     const fileContent = await fs.readFile(filePath, "utf8");
//     // Split the content into lines and parse each as JSON
//     const data = fileContent
//       .split("\n") // Split by newlines
//       .filter((line) => line.trim() !== "") // Remove empty lines
//       .map((line) => JSON.parse(line)); // Parse JSON strings into objects
//     console.log("Parsed JSONL Data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error reading JSONL file:", error);
//     throw error;
//   }
// };
const parseJsonlFile = (content) => {
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
// File path of the JSONL file to parse
// const filePath = "./batchoutput.jsonl";
// // Call the function to parse the JSONL file
// const jsonData = await parseJsonlFile(filePath);
// // Example usage
// jsonData.forEach((entry) => console.log(entry));
