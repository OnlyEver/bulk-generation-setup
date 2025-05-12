import { MongoConceptFactCards } from "../../../../types/mongo_concept_fact_type";
import { RawMcqCardResponseType } from "../../../../types/generate_card_response_type";
export declare class ParseMcqCard {
    parse(data: {
        card_content: RawMcqCardResponseType;
        type: string;
        concepts_facts: MongoConceptFactCards[];
        bloom_level: number;
    }): {
        type: {
            category: string;
            sub_type: string;
        };
        heading: string;
        displayTitle: string;
        content: {
            question: string;
            answers: {
                answer: string;
                is_correct: boolean;
            }[];
        };
        concepts_facts: MongoConceptFactCards[];
        explanation: string | undefined;
        bloom_level: number;
    } | null;
    _generateMcqCardDisplayTitle(question: string, answers: any): string;
    _validate(mcqCard: any): boolean;
    _checkIfAllAnswersAreWrong(answers: any[]): boolean;
}
