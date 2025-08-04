export type SourceTaxonomy = {
    concepts_facts: {
        text: string;
        type: string;
        embedding?: number[];
        reference: string;
    }[];
    fields: string[];
    metadata?: any[];
    generate_cards: {
        state: boolean;
        reason: string;
    };
};
