export type GeneratedCardResponseType = {
    metadata: any;
    test_cards: RawTestCardResponseType[];
    status_code: number;
    usage_data: any;
    generated_at: Date;
};
export type RawTestCardResponseType = {
    type: string;
    card_content: RawFlashCardResponseType | RawMatchCardResponseType | RawClozeCardResponseType | RawMcqCardResponseType;
    concepts: string[];
    facts: string[];
    bloom_level: number;
};
export type RawFlashCardResponseType = {
    front: string;
    back: string;
    explanation?: string;
};
export type RawMatchCardResponseType = {
    left_item: string;
    right_item: string;
}[];
export type RawClozeCardResponseType = {
    correct_options: string[];
    incorrect_options: string[];
    prompt: string;
    explanation?: string;
};
export type RawMcqCardResponseType = {
    prompt: string;
    explanation?: string;
    choices: {
        choice: string;
        is_correct: boolean;
    }[];
};
