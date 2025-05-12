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
exports.parseBreadth = parseBreadth;
const parse_typology_1 = require("../../utils/parse_typology");
const embedding_generation_1 = require("../../embedding_generation/embedding_generation");
const global_consolidation_1 = require("../../embedding_generation/consolidation/global_consolidation");
const write_condolidated_data_1 = require("../../embedding_generation/consolidation/write_condolidated_data");
const local_consolidation_1 = require("../../embedding_generation/consolidation/local_consolidation");
/**
 *
 * For parsing the breadth or typology
 *
 * @param {RawResponse} rawResponse from batch response
 * @returns {ParsedResponse}
 */
function parseBreadth(rawResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestId = rawResponse.request_id;
            const content = rawResponse.response.body.choices[0].message.content;
            const parsedContent = JSON.parse(content);
            const usage = rawResponse.response.body.usage;
            const concepts = parsedContent.concepts.map((concept) => ({
                concept_text: concept.concept_text,
                reference: concept.reference,
                type: "concept",
            }));
            const facts = parsedContent.facts.map((fact) => ({
                concept_text: fact.fact_text,
                reference: fact.reference,
                type: "fact",
            }));
            const mixedConcepts = [...concepts, ...facts];
            const conceptsForEmbedding = mixedConcepts.map((concept) => ({
                text: concept.concept_text,
                type: concept.type,
                reference: concept.reference,
            }));
            const embeddings = yield (0, embedding_generation_1.generateEmbeddings)(conceptsForEmbedding);
            const consolidatedConcepts = (0, local_consolidation_1.localConsolidation)(embeddings.concepts_facts, requestId._source);
            const globalConsolidatedData = yield (0, global_consolidation_1.globalConsolidation)(consolidatedConcepts.sourceTaxonomyOps, requestId._source, 0.8);
            const writeConsolidatedData = new write_condolidated_data_1.WriteConsolidatedData();
            yield writeConsolidatedData.writeConsolidatedData(globalConsolidatedData);
            return {
                requestIdentifier: requestId,
                generated_data: {
                    field: (0, parse_typology_1.parseFields)(parsedContent.field),
                    concepts: globalConsolidatedData.source_taxonomy,
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
    });
}
//# sourceMappingURL=parse_breadth.js.map