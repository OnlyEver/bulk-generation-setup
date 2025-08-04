interface EmbeddingResponse {
    concepts_facts: {
        text: string;
        type: string;
        embedding: number[];
        reference: string;
    }[];
    metadata: {
        req_time: string;
        req_type: {
            type: string;
        };
        req_tokens: number;
        res_tokens: number;
        model: string;
        usage: any;
    };
}
export declare function generateEmbeddings(concepts_facts: {
    text: string;
    type: string;
    reference: string;
}[]): Promise<EmbeddingResponse>;
export {};
