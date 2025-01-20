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
exports.parseResponse = parseResponse;
const mongodb_1 = require("mongodb");
const app_1 = require("../../app");
const parse_depth_1 = require("./parse_depth");
function parseResponse(generatedResponses) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const db = (0, app_1.getDbInstance)();
            const sourceCollection = db.collection("_source");
            for (const elem of generatedResponses) {
                const customId = extractCustomId(elem.custom_id);
                if (customId.request_type.type === "depth") {
                    const taxonomyData = yield sourceCollection.findOne({
                        _id: new mongodb_1.BSON.ObjectId(customId.source_id),
                    }, {
                        projection: { source_taxonomy: 1 },
                    });
                    const rawResponse = {
                        batch_id: elem.id,
                        request_id: customId,
                        response: elem.response.body,
                    };
                    const parsedData = (0, parse_depth_1.parseDepth)({
                        rawResponse: rawResponse,
                        sourceTaxonomy: (_a = taxonomyData === null || taxonomyData === void 0 ? void 0 : taxonomyData.source_taxonomy) !== null && _a !== void 0 ? _a : {},
                    });
                }
                else if (customId.request_type.type === "breadth") {
                    // handle typology parsing
                }
            }
        }
        catch (e) {
            throw Error(e.message);
        }
    });
}
function extractCustomId(customId) {
    const customIdData = JSON.parse(customId);
    return {
        source_id: customIdData.source_id,
        request_type: {
            type: customIdData.request_type.type,
            bloom_level: customIdData.request_type.bloom_level,
            n: customIdData.request,
        },
    };
}
//# sourceMappingURL=parse_batch.js.map