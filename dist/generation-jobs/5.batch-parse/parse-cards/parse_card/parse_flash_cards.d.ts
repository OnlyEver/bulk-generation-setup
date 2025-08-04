import { MongoConceptFactCards } from "../../../../types/mongo_concept_fact_type";
import { RawFlashCardResponseType } from "../../../../types/generate_card_response_type";
export declare class ParseFlashCard {
    parse(data: {
        card_content: RawFlashCardResponseType;
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
            front_content: string;
            back_content: string;
        };
        concepts_facts: MongoConceptFactCards[];
        explanation: string | undefined;
        bloom_level: number;
    } | null;
    generateFlashCardDisplayTitle(front: string, back: string): string;
}
