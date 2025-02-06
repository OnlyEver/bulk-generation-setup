export declare class ParseCardResponse {
    parse(generatedData: any, sourceTaxonomy: any, bloom: number): {
        status_code: number;
        cards_data: any[];
        type?: undefined;
    } | {
        status_code: number;
        type: any;
        cards_data?: undefined;
    };
    _getCardReference(generatedCardData: any, sourceTaxonomy: any): any;
}
