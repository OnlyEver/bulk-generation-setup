type ParsedResponse = {
    request_id: RequestId;
    metadata?: {
        req_type: RequestType;
        req_time: Date;
        req_tokens: number;
        res_tokens: number;
        model: string;
        status: string;
    };
    generated_data: TypologyResponse | CardGenResponse[];
};
type TypologyResponse = {
    status_code: number;
    field: Array<{
        [key: string]: string | boolean;
        reconcile: boolean;
    }>;
    concepts: Array<{
        concept_text: string;
        reference: string;
    }>;
    facts: Array<{
        fact_text: string;
        reference: string;
    }>;
    generate_cards: {
        state: boolean;
        reason: string;
    };
    summary_cards: string[];
};
type CardGenResponse = {};
