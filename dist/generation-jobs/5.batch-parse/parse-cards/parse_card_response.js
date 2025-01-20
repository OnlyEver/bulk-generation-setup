"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCardResponse = void 0;
const parse_cloze_card_1 = require("./parse_card/parse_cloze_card");
const parse_flash_cards_1 = require("./parse_card/parse_flash_cards");
const parse_match_card_1 = require("./parse_card/parse_match_card");
const parse_mcq_card_1 = require("./parse_card/parse_mcq_card");
class ParseCardResponse {
    parse(generatedData, sourceTaxonomy) {
        try {
            const cardData = [];
            const unparsedTestCards = generatedData.test_cards;
            if (unparsedTestCards !== undefined && unparsedTestCards.length != 0) {
                for (let elem of unparsedTestCards) {
                    if (elem.type == "flash") {
                        const flashCard = new parse_flash_cards_1.ParseFlashCard().parse(elem);
                        if (flashCard != null && flashCard) {
                            flashCard.heading = this._getCardReference(flashCard, sourceTaxonomy);
                            cardData.push(flashCard);
                        }
                    }
                    else if (elem.type == "mcq") {
                        const mcqCard = new parse_mcq_card_1.ParseMcqCard().parse(elem);
                        if (mcqCard != null && mcqCard) {
                            mcqCard.heading = this._getCardReference(mcqCard, sourceTaxonomy);
                            cardData.push(mcqCard);
                        }
                    }
                    else if (elem.type == "cloze") {
                        const clozeCard = new parse_cloze_card_1.ParseClozeCard().parse(elem);
                        if (clozeCard && clozeCard != null) {
                            clozeCard.heading = this._getCardReference(clozeCard, sourceTaxonomy);
                            cardData.push(clozeCard);
                        }
                    }
                    else if (elem.type == "match") {
                        const matchCard = new parse_match_card_1.ParseMatchCard().parse(elem);
                        if (matchCard && matchCard != null) {
                            matchCard.heading = this._getCardReference(matchCard, sourceTaxonomy);
                            cardData.push(matchCard);
                        }
                    }
                }
            }
            return {
                status_code: cardData.length == 0 ? 400 : 200,
                cards_data: cardData,
            };
        }
        catch (e) {
            return {
                status_code: 500,
                type: generatedData.type,
            };
        }
    }
    _getCardReference(generatedCardData, sourceTaxonomy) {
        var _a, _b, _c, _d;
        const cardConcepts = (_a = generatedCardData.concepts) !== null && _a !== void 0 ? _a : [];
        const cardFacts = (_b = generatedCardData.facts) !== null && _b !== void 0 ? _b : [];
        const combinedCardFactsAndConcepts = [...cardConcepts, ...cardFacts];
        const sourceConcepts = (_c = sourceTaxonomy.concepts) !== null && _c !== void 0 ? _c : [];
        const sourceFacts = (_d = sourceTaxonomy.facts) !== null && _d !== void 0 ? _d : [];
        const mappedSourceConcepts = sourceConcepts.map((elem) => {
            return {
                text: elem.concept_text,
                reference: elem.reference,
            };
        });
        const mappedSourceFacts = sourceFacts.map((elem) => {
            return {
                text: elem.fact_text,
                reference: elem.reference,
            };
        });
        const compinedConceptsAndFacts = [
            ...mappedSourceConcepts,
            ...mappedSourceFacts,
        ];
        const firstMatchedConcept = compinedConceptsAndFacts.find((elem) => combinedCardFactsAndConcepts.includes(elem.text));
        if (firstMatchedConcept) {
            return firstMatchedConcept.reference;
        }
        else {
            return "";
        }
    }
}
exports.ParseCardResponse = ParseCardResponse;
//# sourceMappingURL=parse_card_response.js.map