"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    openAiKey: process.env.OPENAIKEY,
    dbUri: process.env.DB_URI
};
