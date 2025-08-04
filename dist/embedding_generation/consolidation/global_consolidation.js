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
exports.globalConsolidation = globalConsolidation;
const qdrant_db_helper_1 = require("../../helper/qdrant_db_helper");
function globalConsolidation(locally_consolidated_concepts_facts, sourceId, threshold) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // / for all concepts_facts, find the ,most similar concepts_facts in qdrant, threshold of 0.8
        const similarConcepts = yield (0, qdrant_db_helper_1.getCorrespondingConcepts)("concepts-vectors", locally_consolidated_concepts_facts, threshold !== null && threshold !== void 0 ? threshold : 0.8);
        const taxonomyConcepts = [];
        const globalUpdatesOps = [];
        const globalInsertsOps = [];
        for (const index in similarConcepts) {
            const points = similarConcepts[index].points;
            const originalConcept = locally_consolidated_concepts_facts[index];
            if (points.length == 0) {
                taxonomyConcepts.push({
                    id: originalConcept.id,
                    text: originalConcept.text,
                    type: originalConcept.type,
                    reference: originalConcept.reference,
                });
                globalInsertsOps.push({
                    id: originalConcept.id,
                    vector: originalConcept.embedding,
                    payload: {
                        _sources: [sourceId],
                        text: originalConcept.text,
                    },
                });
            }
            else {
                const consolidatedId = points[0].id;
                const currentPayload = points[0].payload;
                // const currentSources = currentPayload?['_sources'] ?? [];
                taxonomyConcepts.push({
                    id: consolidatedId.toString(),
                    text: originalConcept.text,
                    type: originalConcept.type,
                    reference: originalConcept.reference,
                });
                globalUpdatesOps.push({
                    id: consolidatedId.toString(),
                    sourceIdToAdd: sourceId,
                    currentPayload: {
                        // _sources: currentPayload['_sources'] ?? [],
                        _sources: ((_a = currentPayload === null || currentPayload === void 0 ? void 0 : currentPayload._sources) !== null && _a !== void 0 ? _a : []),
                        text: ((_b = currentPayload === null || currentPayload === void 0 ? void 0 : currentPayload.text) !== null && _b !== void 0 ? _b : "").toString(),
                    },
                });
            }
        }
        return {
            source_taxonomy: taxonomyConcepts,
            global_updates: globalUpdatesOps,
            global_inserts: globalInsertsOps,
        };
        /// if threshold is below 0.8, then add the concept_fact to qdrant
        /// if threshold is above 0.8, then replace the id of the local concept_fact with the id of the global concept_fact
        /// add _source.id to qdrant
        /// return the concepts_facts
    });
}
//# sourceMappingURL=global_consolidation.js.map