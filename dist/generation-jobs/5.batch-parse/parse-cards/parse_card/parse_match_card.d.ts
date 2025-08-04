import { RawMatchCardResponseType } from "../../../../types/generate_card_response_type";
import { MongoConceptFactCards } from "../../../../types/mongo_concept_fact_type";
type InputItem = {
    left_item: string;
    right_item: string;
};
type OutputItem = {
    left_item: string;
    right_item: string[];
};
export declare class ParseMatchCard {
    parse(cardData: {
        card_content: RawMatchCardResponseType;
        type: string;
        concepts_facts: MongoConceptFactCards[];
        bloom_level: number;
    }): any;
    _generateMatchCardDisplayTitle(answers: any): string;
    _parseMatchContent: (input: InputItem[]) => OutputItem[];
    _validateMatch(matchCard: any): any;
}
export {};
