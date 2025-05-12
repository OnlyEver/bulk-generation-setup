export type SourceTaxonomy = {
    concepts_facts: {
        text: string;
        type: string;
        /// will only be present temporarily and wont be stored in database
        embedding?: number[];
        reference: string;
    }[];
    fields: string[];

    /// will only be present temporarily and wont be stored in database
    metadata?: any[];
    generate_cards: {
        state: boolean;
        reason: string;
    };
};
