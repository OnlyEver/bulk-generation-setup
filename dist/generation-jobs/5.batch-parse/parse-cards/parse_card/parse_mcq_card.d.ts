export declare class ParseMcqCard {
    parse(data: any): any;
    _generateMcqCardDisplayTitle(question: string, answers: any): string;
    _validate(mcqCard: any): boolean;
    _checkIfAllAnswersAreWrong(answers: any[]): boolean;
}
