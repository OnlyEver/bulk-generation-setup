import { ParseClozeCard } from "./parse_card/parse_cloze_card";
import { ParseFlashCard } from "./parse_card/parse_flash_cards";
import { ParseMatchCard } from "./parse_card/parse_match_card";
import { ParseMcqCard } from "./parse_card/parse_mcq_card";
import {
  GeneratedCardResponseType,
  RawClozeCardResponseType,
  RawFlashCardResponseType,
  RawMatchCardResponseType,
  RawMcqCardResponseType,
  RawTestCardResponseType,
} from "../../../types/generate_card_response_type";
import { SourceTaxonomy } from "../../../types/source_taxonomy_type";
import {
  MongoConceptFactCards,
  MongoConceptFactSource,
} from "../../../types/mongo_concept_fact_type";
import { ParsedCardType } from "../../../types/parsed_card_type";
export class ParseCardResponse {
  async parse(
    generatedData: GeneratedCardResponseType,
    isGapFill: boolean,
    sourceTaxonomy: SourceTaxonomy,
    bloom_level: number
  ) {
    let usage_data = generatedData.metadata;
    try {
      const cardData: ParsedCardType[] = [];
      const unparsedTestCards = generatedData.test_cards;

      if (unparsedTestCards !== undefined && unparsedTestCards.length != 0) {
        for (let elem of unparsedTestCards) {
          elem.bloom_level = bloom_level;
          const concepts = (elem.concepts ?? []).map((e: any) => {
            return {
              text: e,
              type: "concept",
            };
          });
          const facts = (elem.facts ?? []).map((e: any) => {
            return {
              text: e,
              type: "fact",
            };
          });
          const concepts_facts = [...concepts, ...facts];
          const managedCardConcepts = this._mapIdToConcepts(
            concepts_facts,
            sourceTaxonomy.concepts_facts
          );

          if (elem.type == "flash") {
            const flashCard = new ParseFlashCard().parse({
              card_content: elem.card_content as RawFlashCardResponseType,
              type: elem.type,
              concepts_facts: managedCardConcepts,
              bloom_level: elem.bloom_level,
            });
            if (flashCard != null && flashCard) {
              flashCard.heading = this._getCardReference(
                flashCard,
                sourceTaxonomy
              );

              cardData.push(flashCard);
            }
          } else if (elem.type == "mcq") {
            const mcqCard = new ParseMcqCard().parse({
              card_content: elem.card_content as RawMcqCardResponseType,
              type: elem.type,
              concepts_facts: managedCardConcepts,
              bloom_level: elem.bloom_level,
            });
            if (mcqCard != null && mcqCard) {
              mcqCard.heading = this._getCardReference(mcqCard, sourceTaxonomy);
              cardData.push(mcqCard);
            }
          } else if (elem.type == "cloze") {
            const clozeCard = new ParseClozeCard().parse({
              card_content: elem.card_content as RawClozeCardResponseType,
              type: elem.type,
              concepts_facts: managedCardConcepts,
              bloom_level: elem.bloom_level,
            });
            if (clozeCard && clozeCard != null) {
              clozeCard.heading = this._getCardReference(
                clozeCard,
                sourceTaxonomy
              );
              cardData.push(clozeCard);
            }
          } else if (elem.type == "match") {
            const matchCard = new ParseMatchCard().parse({
              card_content: elem.card_content as RawMatchCardResponseType,
              type: elem.type,
              concepts_facts: managedCardConcepts,
              bloom_level: elem.bloom_level,
            });
            if (matchCard && matchCard != null) {
              matchCard.heading = this._getCardReference(
                matchCard,
                sourceTaxonomy
              );
              cardData.push(matchCard);
            }
          }
        }
      } else {
        if (!isGapFill) {
          usage_data.status = "failed";
        }
      }
      if (cardData.length == 0) {
        usage_data.status = "failed";
      }

      return {
        status_code: cardData.length == 0 ? 400 : 200,
        metadata: usage_data,
        type: "card_gen",

        cards_data: cardData,
      };
    } catch (e: any) {
      // await new ErrorLogger({
      //   type: "card_parsing",
      //   data: {
      //     error: e.message,
      //     generatedData: generatedData,
      //     sourceTaxonomy: sourceTaxonomy,
      //   },
      // }).log();
      return {
        status_code: 500,
        metadata: usage_data,
        type: "card_gen",
      };
    }
  }

  _parseCard(generatedCardData: any, sourceTaxonomy: any) {
    const cardData: ParsedCardType[] = [];
    const concepts = (generatedCardData.concepts ?? []).map((e: any) => {
      return {
        text: e,
        type: "concept",
      };
    });
  }
  _getCardReference(card: any, sourceTaxonomy: any) {
    const cardConcepts = (card.concepts_facts ?? []) as MongoConceptFactCards[];
    const sourceConceptsFacts = (sourceTaxonomy.concepts_facts ??
      []) as MongoConceptFactSource[];
    if (cardConcepts.length == 0 || sourceConceptsFacts.length == 0) {
      return "";
    }

    const firstMatchedConcept = sourceConceptsFacts.find(
      (e: any) => cardConcepts[0].id == e.id
    );

    if (firstMatchedConcept) {
      return firstMatchedConcept.reference;
    } else {
      return "";
    }
  }

  _mapIdToConcepts(
    cardConcepts: any[],
    sourceConceptsFacts: any[]
  ): MongoConceptFactCards[] {
    // const cardData = cardC
    const managedCardConcepts = [];
    for (const cardConcept of cardConcepts) {
      const matchedConcept = sourceConceptsFacts.find(
        (e: any) =>
          e.text.toLowerCase().trim() == cardConcept.text.toLowerCase().trim()
      );
      if (matchedConcept) {
        managedCardConcepts.push({
          id: matchedConcept.id,
          text: matchedConcept.text,
          type: matchedConcept.type,
        });
      }
    }
    return managedCardConcepts;
  }
}
