"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseFlashCard = void 0;
class ParseFlashCard {
    parse(data) {
        try {
            let displayTitle = this.generateFlashCardDisplayTitle(data.card_content.front, data.card_content.back);
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
        }
        catch (e) {
            return null;
        }
    }
    generateFlashCardDisplayTitle(front, back) {
        return `${front} ---- ${back}`;
    }
}
exports.ParseFlashCard = ParseFlashCard;
//# sourceMappingURL=parse_flash_cards.js.map