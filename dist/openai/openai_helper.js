"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAI = exports.setOpenAIKey = void 0;
const openai_1 = __importDefault(require("openai"));
var openai;
const setOpenAIKey = (openaiKey) => {
    openai = new openai_1.default({
        apiKey: openaiKey,
    });
};
exports.setOpenAIKey = setOpenAIKey;
const openAI = () => openai;
exports.openAI = openAI;
