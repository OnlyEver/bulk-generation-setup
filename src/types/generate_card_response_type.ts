import { CardTypeEnum } from "../enums/card_type_enum";

export type GeneratedCardResponseType = {
    metadata: any;
    test_cards: RawTestCardResponseType[];
    // generated_content: {
    //     test_cards: RawTestCardResponseType[];
    // };
    status_code: number;
    usage_data: any;
    generated_at: Date;
};

export type RawTestCardResponseType = {
    type: string;
    // type:
    //   | CardTypeEnum.FLASH
    //   | CardTypeEnum.MATCH
    //   | CardTypeEnum.MCQ
    //   | CardTypeEnum.CLOZE;
    card_content:
    | RawFlashCardResponseType
    | RawMatchCardResponseType
    | RawClozeCardResponseType
    | RawMcqCardResponseType;
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

//
// flash : 1
// cloze 0,
// match 2
// mcq 3
