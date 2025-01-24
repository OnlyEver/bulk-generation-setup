export declare class ParseFlashCard {
    parse(data: any): {
        type: {
            category: string;
            sub_type: any;
        };
        heading: string;
        displayTitle: string;
        content: {
            front_content: any;
            back_content: any;
        };
        concepts: any;
        explanation: any;
        facts: any;
    } | null;
    generateFlashCardDisplayTitle(front: string, back: string): string;
}
