"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCardResponse = void 0;
const parse_cloze_card_1 = require("./parse_card/parse_cloze_card");
const parse_flash_cards_1 = require("./parse_card/parse_flash_cards");
const parse_match_card_1 = require("./parse_card/parse_match_card");
const parse_mcq_card_1 = require("./parse_card/parse_mcq_card");
class ParseCardResponse {
    parse(generatedData, isGapFill, sourceTaxonomy, bloom_level) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let usage_data = generatedData.metadata;
            try {
                const cardData = [];
                const unparsedTestCards = generatedData.test_cards;
                if (unparsedTestCards !== undefined && unparsedTestCards.length != 0) {
                    for (let elem of unparsedTestCards) {
                        elem.bloom_level = bloom_level;
                        const concepts = ((_a = elem.concepts) !== null && _a !== void 0 ? _a : []).map((e) => {
                            return {
                                text: e,
                                type: "concept",
                            };
                        });
                        const facts = ((_b = elem.facts) !== null && _b !== void 0 ? _b : []).map((e) => {
                            return {
                                text: e,
                                type: "fact",
                            };
                        });
                        const concepts_facts = [...concepts, ...facts];
                        const managedCardConcepts = this._mapIdToConcepts(concepts_facts, sourceTaxonomy.concepts_facts);
                        if (elem.type == "flash") {
                            const flashCard = new parse_flash_cards_1.ParseFlashCard().parse({
                                card_content: elem.card_content,
                                type: elem.type,
                                concepts_facts: managedCardConcepts,
                                bloom_level: elem.bloom_level,
                            });
                            if (flashCard != null && flashCard) {
                                flashCard.heading = this._getCardReference(flashCard, sourceTaxonomy);
                                cardData.push(flashCard);
                            }
                        }
                        else if (elem.type == "mcq") {
                            const mcqCard = new parse_mcq_card_1.ParseMcqCard().parse({
                                card_content: elem.card_content,
                                type: elem.type,
                                concepts_facts: managedCardConcepts,
                                bloom_level: elem.bloom_level,
                            });
                            if (mcqCard != null && mcqCard) {
                                mcqCard.heading = this._getCardReference(mcqCard, sourceTaxonomy);
                                cardData.push(mcqCard);
                            }
                        }
                        else if (elem.type == "cloze") {
                            const clozeCard = new parse_cloze_card_1.ParseClozeCard().parse({
                                card_content: elem.card_content,
                                type: elem.type,
                                concepts_facts: managedCardConcepts,
                                bloom_level: elem.bloom_level,
                            });
                            if (clozeCard && clozeCard != null) {
                                clozeCard.heading = this._getCardReference(clozeCard, sourceTaxonomy);
                                cardData.push(clozeCard);
                            }
                        }
                        else if (elem.type == "match") {
                            const matchCard = new parse_match_card_1.ParseMatchCard().parse({
                                card_content: elem.card_content,
                                type: elem.type,
                                concepts_facts: managedCardConcepts,
                                bloom_level: elem.bloom_level,
                            });
                            if (matchCard && matchCard != null) {
                                matchCard.heading = this._getCardReference(matchCard, sourceTaxonomy);
                                cardData.push(matchCard);
                            }
                        }
                    }
                }
                else {
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
            }
            catch (e) {
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
        });
    }
    _parseCard(generatedCardData, sourceTaxonomy) {
        var _a;
        const cardData = [];
        const concepts = ((_a = generatedCardData.concepts) !== null && _a !== void 0 ? _a : []).map((e) => {
            return {
                text: e,
                type: "concept",
            };
        });
    }
    _getCardReference(card, sourceTaxonomy) {
        var _a, _b;
        const cardConcepts = ((_a = card.concepts_facts) !== null && _a !== void 0 ? _a : []);
        const sourceConceptsFacts = ((_b = sourceTaxonomy.concepts_facts) !== null && _b !== void 0 ? _b : []);
        if (cardConcepts.length == 0 || sourceConceptsFacts.length == 0) {
            return "";
        }
        const firstMatchedConcept = sourceConceptsFacts.find((e) => cardConcepts[0].id == e.id);
        if (firstMatchedConcept) {
            return firstMatchedConcept.reference;
        }
        else {
            return "";
        }
    }
    _mapIdToConcepts(cardConcepts, sourceConceptsFacts) {
        // const cardData = cardC
        const managedCardConcepts = [];
        for (const cardConcept of cardConcepts) {
            const matchedConcept = sourceConceptsFacts.find((e) => e.text.toLowerCase().trim() == cardConcept.text.toLowerCase().trim());
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
exports.ParseCardResponse = ParseCardResponse;
//# sourceMappingURL=parse_card_response.js.map