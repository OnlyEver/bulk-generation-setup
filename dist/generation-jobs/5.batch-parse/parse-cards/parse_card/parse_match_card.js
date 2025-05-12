"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseMatchCard = void 0;
class ParseMatchCard {
    constructor() {
        this._parseMatchContent = (input) => {
            const grouped = input.reduce((acc, { left_item, right_item }) => {
                if (!acc[left_item]) {
                    acc[left_item] = { left_item, right_item: [] };
                }
                acc[left_item].right_item.push(right_item);
                return acc;
            }, {});
            return Object.values(grouped);
        };
    }
    parse(cardData) {
        try {
            let content = cardData.card_content;
            const finalContent = this._parseMatchContent(content);
            let displayTitle = this._generateMatchCardDisplayTitle(content);
            let matchCard = {
                type: {
                    category: "learning",
                    sub_type: cardData.type,
                },
                heading: "",
                content: finalContent,
                //  content: cardData.card_content,
                displayTitle: displayTitle,
                concepts_facts: cardData.concepts_facts,
                bloom_level: cardData.bloom_level,
            };
            return this._validateMatch(matchCard);
        }
        catch (e) {
            return null;
        }
    }
    _generateMatchCardDisplayTitle(answers) {
        let titles = [];
        let counter = 65;
        for (let data of answers) {
            let value = data.right_item;
            let leftData = data.left_item;
            let letter = String.fromCharCode(counter);
            titles.push(`${letter}. ${leftData} -- ${value}`);
            counter++;
        }
        let displayTitle = titles.join(",");
        return displayTitle;
    }
    _validateMatch(matchCard) {
        let matches = matchCard.content;
        let content = [];
        try {
            if (matches.length < 1 || matches.length > 8) {
                throw Error("Invalid number of matches");
            }
            for (let elem of matches) {
                if (elem.left_item.length <= 30 && elem.left_item.length != 0) {
                    if (elem.right_item.length <= 40 && elem.right_item.length != 0) {
                        content.push(elem);
                    }
                }
            }
            if (content.length >= 2) {
                matchCard.content = content;
            }
            else {
                throw Error("Invalid content");
            }
            return matchCard;
        }
        catch (e) {
            return null;
        }
    }
}
exports.ParseMatchCard = ParseMatchCard;
//# sourceMappingURL=parse_match_card.js.map