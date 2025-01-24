"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBreadth = parseBreadth;
const parse_typology_1 = require("../../utils/parse_typology");
/**
 *
 * For parsing the breadth or typology
 *
 * @param {RawResponse} rawResponse from batch response
 * @returns {ParsedResponse}
 */
function parseBreadth(rawResponse) {
    try {
        const requestId = rawResponse.request_id;
        const content = rawResponse.response.body.choices[0].message.content;
        const parsedContent = JSON.parse(content);
        const usage = rawResponse.response.usage;
        return {
            requestIdentifier: requestId,
            generated_data: {
                field: (0, parse_typology_1.parseFields)(parsedContent.field),
                concepts: parsedContent.concepts.map((fact) => ({
                    fact_text: fact.fact_text,
                    reference: fact.reference,
                })),
                facts: parsedContent.facts.map((fact) => ({
                    fact_text: fact.fact_text,
                    reference: fact.reference,
                })),
                generate_cards: {
                    state: parsedContent.generate_cards.state,
                    reason: parsedContent.generate_cards.reason,
                },
                summary_cards: parsedContent.summary_cards,
            },
            metadata: {
                req_type: requestId.request_type,
                req_time: new Date(),
                req_tokens: usage === null || usage === void 0 ? void 0 : usage.prompt_tokens,
                res_tokens: usage === null || usage === void 0 ? void 0 : usage.completion_tokens,
                model: "gpt-4o-mini",
                status: "completed",
            },
        };
    }
    catch (error) {
        console.error("Error occurred while parsing breadth:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to parse breadth: ${errorMessage}`);
    }
}
//# sourceMappingURL=parse_breadth.js.map