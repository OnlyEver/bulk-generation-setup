import { MongoConceptFactCards } from "../../../../types/mongo_concept_fact_type";
import { RawClozeCardResponseType } from "../../../../types/generate_card_response_type";
export declare class ParseClozeCard {
    parse(data: {
        card_content: RawClozeCardResponseType;
        type: string;
        concepts_facts: MongoConceptFactCards[];
        bloom_level: number;
    }): any;
    _generateClozeCardDisplayTitle(question: string, answers: Array<any>): string;
    _prepareQuestionAndCorrectAnswers(rawPrompt: String, correctOptions: Array<any>): {
        prompt: string;
        options: any;
    };
    _validateCloze(clozeCard: any): any;
}
