"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localConsolidation = localConsolidation;
const crypto_1 = require("crypto");
function localConsolidation(concepts_facts, sourceId) {
    try {
        const sourceIds = [];
        const sourceTaxonomyOps = [];
        const globalConceptOps = [];
        const consolidatedConcepts = [];
        const concepts = concepts_facts.map((e) => {
            return {
                id: (0, crypto_1.randomUUID)().toString(),
                text: e.text,
                reference: e.reference,
                embedding: e.embedding,
                type: e.type,
            };
        });
        const afterConsolidation = consolidateSimilarEmbeddings(concepts);
        sourceIds.push(JSON.stringify(sourceId));
        console.log(afterConsolidation);
        for (var concept of afterConsolidation.finalConsolidatedConcepts) {
            sourceTaxonomyOps.push({
                text: concept.text,
                id: concept.id,
                embedding: concept.embedding,
                type: concept.type,
                reference: concept.reference,
            });
            globalConceptOps.push({
                id: concept.id.toString(),
                vector: concept.embedding,
                payload: {
                    _sources: [sourceId],
                    text: concept.text,
                },
            });
        }
        consolidatedConcepts.push(...afterConsolidation.consolidatedConcepts);
        return {
            globalConceptOps: globalConceptOps,
            sourceIds: sourceIds,
            consolidatedConcepts: consolidatedConcepts,
            sourceTaxonomyOps: sourceTaxonomyOps,
        };
    }
    catch (e) {
        console.error("Error occurred while converting the parsed array to db operations:", e);
        throw e;
    }
    // const concepts = concepts_facts.map((e) => {
    //   return {
    //     id: randomUUID().toString(),
    //     text: e.text,
    //     type: e.type,
    //     embedding: e.embedding,
    //   };
    // });
    // const consolidated = this._consolidateSimilarEmbeddings(concepts);
    // return consolidated;
}
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((acc, val, index) => acc + val * b[index], 0);
    const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
;
function consolidateSimilarEmbeddings(data, threshold = 0.65) {
    const finalConsolidatedConcepts = [];
    const visited = new Array(data.length).fill(false);
    const consolidatedConcepts = [];
    for (let i = 0; i < data.length; i++) {
        if (visited[i])
            continue;
        const group = [data[i]];
        visited[i] = true;
        for (let j = i + 1; j < data.length; j++) {
            if (visited[j])
                continue;
            const sim = cosineSimilarity(data[i].embedding, data[j].embedding);
            if (sim > threshold) {
                group.push(data[j]);
                visited[j] = true;
                consolidatedConcepts.push({
                    concept1: data[i].text,
                    concept2: data[j].text,
                    similarity: sim,
                });
            }
        }
        // Consolidate the group (e.g., just take the first, or merge)
        finalConsolidatedConcepts.push(group[0]); // Or you can customize how to merge
    }
    return {
        finalConsolidatedConcepts: finalConsolidatedConcepts,
        consolidatedConcepts: consolidatedConcepts,
    };
}
//# sourceMappingURL=local_consolidation.js.map