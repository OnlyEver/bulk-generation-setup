export declare class ParseClozeCard {
    parse(data: any): any;
    _generateClozeCardDisplayTitle(question: string, answers: Array<any>): string;
    _prepareQuestionAndCorrectAnswers(rawPrompt: String, correctOptions: Array<any>): {
        prompt: string;
        options: any;
    };
    _validateCloze(clozeCard: any): any;
}
