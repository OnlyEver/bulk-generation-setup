import { MongoConceptFactCards } from "../../../../types/mongo_concept_fact_type";
import { RawFlashCardResponseType } from "../../../../types/generate_card_response_type";

export class ParseFlashCard {
  parse(data: {
    card_content: RawFlashCardResponseType;
    type: string;
    concepts_facts: MongoConceptFactCards[];
    bloom_level: number;
  }) {
    try {
      let displayTitle = this.generateFlashCardDisplayTitle(
        data.card_content.front,
        data.card_content.back
      );
      let flashCardData = {
        type: {
          category: "learning",
          sub_type: "flash",
        },
        heading: "",
        displayTitle: displayTitle,
        content: {
          front_content: data.card_content.front,
          back_content: data.card_content.back,
        },
        concepts_facts: data.concepts_facts,
        explanation: data.card_content.explanation,
        bloom_level: data.bloom_level,
      };

      return flashCardData;
    } catch (e) {
      return null;
    }
  }

  generateFlashCardDisplayTitle(front: string, back: string) {
    return `${front} ---- ${back}`;
  }
}
