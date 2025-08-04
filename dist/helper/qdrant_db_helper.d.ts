declare const createCollection: (collectionName: string) => Promise<void>;
declare const getCollection: () => Promise<{
    collections: {
        name: string;
    }[];
}>;
declare const getCorrespondingConcepts: (collectionName: string, embeddings: {
    text: string;
    id: string;
    type: string;
    reference: string;
    embedding: number[];
}[], threshold: number) => Promise<{
    points: {
        id: string | number;
        version: number;
        score: number;
        payload?: Record<string, unknown> | {
            [key: string]: unknown;
        } | null | undefined;
        vector?: Record<string, unknown> | number[] | number[][] | {
            [key: string]: number[] | number[][] | {
                indices: number[];
                values: number[];
            } | undefined;
        } | null | undefined;
        shard_key?: string | number | Record<string, unknown> | null | undefined;
        order_value?: number | Record<string, unknown> | null | undefined;
    }[];
}[]>;
declare const addEmbeddingsToCollection: (collectionName: string, embeddings: {
    id: string;
    vector: number[];
    payload: {
        _sources: string[];
        text: string;
    };
}[]) => Promise<void>;
export { createCollection, getCollection, addEmbeddingsToCollection, getCorrespondingConcepts, };
