"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_client_rest_1 = require("@qdrant/js-client-rest");
const config_1 = require("../config");
// or connect to Qdrant Cloud
const qdrantClient = new js_client_rest_1.QdrantClient({
    url: config_1.config.qdrantUrl,
    apiKey: config_1.config.qdrantApiKey,
});
exports.default = qdrantClient;
//# sourceMappingURL=qdrant_services.js.map