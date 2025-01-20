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
        return {
            request_id: requestId,
            generated_data: {
                status_code: 200,
                field: (0, parse_typology_1.parseFields)(parsedContent.field),
                concepts: parsedContent.facts.map((fact) => ({
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
        };
    }
    catch (error) {
        console.error("Error occurred while parsing breadth:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to parse breadth: ${errorMessage}`);
    }
}
