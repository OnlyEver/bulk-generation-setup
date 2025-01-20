type InputItem = {
    left_item: string;
    right_item: string;
};
type OutputItem = {
    left_item: string;
    right_item: string[];
};
export declare class ParseMatchCard {
    parse(cardData: any): any;
    _generateMatchCardDisplayTitle(answers: any): string;
    _parseMatchContent: (input: InputItem[]) => OutputItem[];
    _validateMatch(matchCard: any): any;
}
export {};
