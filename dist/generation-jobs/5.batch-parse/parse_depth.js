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
exports.parseDepth = parseDepth;
const parse_card_response_1 = require("./parse-cards/parse_card_response");
function parseDepth(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const rawResponse = params.rawResponse;
            const requestId = rawResponse.request_id;
            const response = rawResponse.response.body;
            const usage = rawResponse.response.body.usage;
            const generatedData = JSON.parse(response.choices[0].message.content);
            const cardData = yield new parse_card_response_1.ParseCardResponse().parse(generatedData, ((_b = (_a = requestId.request_type) === null || _a === void 0 ? void 0 : _a.n) !== null && _b !== void 0 ? _b : 1) > 1, params.sourceTaxonomy, (_d = (_c = requestId.request_type) === null || _c === void 0 ? void 0 : _c.bloom_level) !== null && _d !== void 0 ? _d : 1);
            const cardResponse = {
                cards_data: (_e = cardData.cards_data) !== null && _e !== void 0 ? _e : [],
                missing_facts: [],
                missing_concepts: [],
            };
            return {
                requestIdentifier: requestId,
                metadata: {
                    req_type: requestId.request_type,
                    req_time: new Date(),
                    req_tokens: usage === null || usage === void 0 ? void 0 : usage.prompt_tokens,
                    res_tokens: usage === null || usage === void 0 ? void 0 : usage.completion_tokens,
                    model: "gpt-4o-mini",
                    status: "completed",
                },
                generated_data: cardResponse,
            };
        }
        catch (e) {
            throw Error(e.message);
        }
    });
}
//# sourceMappingURL=parse_depth.js.map