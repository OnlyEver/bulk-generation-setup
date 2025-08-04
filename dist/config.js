"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    openAiKey: process.env.OPENAIKEY,
    dbUri: (_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : "",
    dbName: process.env.DB_NAME,
    qdrantApiKey: process.env.QDRANT_API_KEY,
    qdrantUrl: process.env.QDRANT_URL,
};
//# sourceMappingURL=config.js.map