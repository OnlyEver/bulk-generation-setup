export type ParsedCardType = {
    type: {
        category: string;
        sub_type: string;
    };
    heading: string;
    displayTitle: string;
    content: any;
    explanation?: string;
    bloom_level?: number;
};
