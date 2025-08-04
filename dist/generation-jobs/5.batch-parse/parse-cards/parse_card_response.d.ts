import { GeneratedCardResponseType } from "../../../types/generate_card_response_type";
import { SourceTaxonomy } from "../../../types/source_taxonomy_type";
import { MongoConceptFactCards } from "../../../types/mongo_concept_fact_type";
import { ParsedCardType } from "../../../types/parsed_card_type";
export declare class ParseCardResponse {
    parse(generatedData: GeneratedCardResponseType, isGapFill: boolean, sourceTaxonomy: SourceTaxonomy, bloom_level: number): Promise<{
        status_code: number;
        metadata: any;
        type: string;
        cards_data: ParsedCardType[];
    } | {
        status_code: number;
        metadata: any;
        type: string;
        cards_data?: undefined;
    }>;
    _parseCard(generatedCardData: any, sourceTaxonomy: any): void;
    _getCardReference(card: any, sourceTaxonomy: any): string;
    _mapIdToConcepts(cardConcepts: any[], sourceConceptsFacts: any[]): MongoConceptFactCards[];
}
