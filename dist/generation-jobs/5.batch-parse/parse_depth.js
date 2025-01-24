"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDepth = parseDepth;
const parse_card_response_1 = require("./parse-cards/parse_card_response");
function parseDepth(params) {
    var _a;
    try {
        const rawResponse = params.rawResponse;
        const requestId = rawResponse.request_id;
        const response = rawResponse.response.body;
        const usage = response.usage;
        const generatedData = JSON.parse(response.choices[0].message.content);
        const cardData = new parse_card_response_1.ParseCardResponse().parse(generatedData, params.sourceTaxonomy);
        const cardResponse = {
            cards_data: (_a = cardData.cards_data) !== null && _a !== void 0 ? _a : [],
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
}
//# sourceMappingURL=parse_depth.js.map