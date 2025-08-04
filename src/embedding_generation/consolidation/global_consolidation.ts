import { getCorrespondingConcepts } from "../../helper/qdrant_db_helper";

export async function globalConsolidation(
    locally_consolidated_concepts_facts: {
        text: string;
        type: string;
        reference: string;
        id: string;
        embedding: number[];
    }[],
    sourceId: string,
    threshold: number
) {
    // / for all concepts_facts, find the ,most similar concepts_facts in qdrant, threshold of 0.8
    const similarConcepts = await getCorrespondingConcepts(
        "concepts-vectors",
        locally_consolidated_concepts_facts,
        threshold ?? 0.8
    );
    const taxonomyConcepts: {
        text: string;
        type: string;
        reference: string;
        id: string;
    }[] = [];

    const globalUpdatesOps: {
        id: string;
        sourceIdToAdd: string;
        currentPayload: {
            _sources: string[];
            text: string;
        };
    }[] = [];

    const globalInsertsOps: {
        id: string;
        vector: number[];
        payload: {
            _sources: string[];
            text: string;
        };
    }[] = [];
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
        } else {
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
                    _sources: (currentPayload?._sources ?? []) as string[],
                    text: (currentPayload?.text ?? "").toString(),
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
}

