export declare class ParseMcqCard {
    parse(data: any): {
        type: {
            category: string;
            sub_type: any;
        };
        heading: string;
        displayTitle: string;
        content: {
            question: any;
            answers: {
                answer: any;
                is_correct: any;
            }[];
        };
        concepts: any;
        facts: any;
        explanation: any;
    } | null;
    _generateMcqCardDisplayTitle(question: string, answers: any): string;
    _validate(mcqCard: any): boolean;
    _checkIfAllAnswersAreWrong(answers: any[]): boolean;
}
