export declare function globalConsolidation(locally_consolidated_concepts_facts: {
    text: string;
    type: string;
    reference: string;
    id: string;
    embedding: number[];
}[], sourceId: string, threshold: number): Promise<{
    source_taxonomy: {
        text: string;
        type: string;
        reference: string;
        id: string;
    }[];
    global_updates: {
        id: string;
        sourceIdToAdd: string;
        currentPayload: {
            _sources: string[];
            text: string;
        };
    }[];
    global_inserts: {
        id: string;
        vector: number[];
        payload: {
            _sources: string[];
            text: string;
        };
    }[];
}>;
