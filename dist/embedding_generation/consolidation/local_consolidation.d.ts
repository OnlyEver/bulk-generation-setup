export declare function localConsolidation(concepts_facts: {
    text: string;
    type: string;
    embedding: number[];
    reference: string;
}[], sourceId: string): {
    globalConceptOps: {
        id: string;
        vector: number[];
        payload: {
            _sources: string[];
            text: string;
        };
    }[];
    sourceIds: string[];
    consolidatedConcepts: any[];
    sourceTaxonomyOps: {
        text: string;
        id: string;
        embedding: number[];
        type: string;
        reference: string;
    }[];
};
