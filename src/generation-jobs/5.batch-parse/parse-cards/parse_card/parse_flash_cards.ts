export class ParseFlashCard {
  parse(data: any) {
    try {
      let displayTitle = this.generateFlashCardDisplayTitle(
        data.card_content.front,
        data.card_content.back
      );
      let flashCardData = {
        type: {
          category: "learning",
          sub_type: data.type,
        },
        heading: "",
        displayTitle: displayTitle,
        content: {
          front_content: data.card_content.front,
          back_content: data.card_content.back,
        },
        concepts: data.concepts,
        explanation: data.card_content.explanation,
        facts: data.facts,
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
