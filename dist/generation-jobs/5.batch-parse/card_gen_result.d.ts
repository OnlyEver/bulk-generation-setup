export declare function parseCardGenResponse(generatedData: any, isGapFill: boolean, headings: Array<any>): {
    status_code: number;
    type: any;
    missing_concepts: never[];
    missing_facts: never[];
    cards_data: {
        type: {
            category: string;
            sub_type: any;
        };
        heading: any;
        content: any;
        displayTitle: string;
        concepts: any;
        facts: any;
        bloomLevel: any;
    }[];
} | {
    status_code: number;
    type: any;
    missing_concepts?: undefined;
    missing_facts?: undefined;
    cards_data?: undefined;
};
