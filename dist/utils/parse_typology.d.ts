export declare function parseTypologyOnSuccess(responseData: any): {
    status_code: number;
    field: {
        [x: string]: string | boolean;
        reconcile: boolean;
    }[];
    concepts: any;
    facts: any;
    generate_cards: any;
    summary_cards: any;
};
export declare function parseFields(fields: Array<string>): {
    [x: string]: string | boolean;
    reconcile: boolean;
}[];
