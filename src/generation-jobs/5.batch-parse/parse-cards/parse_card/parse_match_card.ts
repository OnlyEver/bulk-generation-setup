import { match } from "assert";

type InputItem = {
  left_item: string;
  right_item: string;
};

type OutputItem = {
  left_item: string;
  right_item: string[];
};

export class ParseMatchCard {
  parse(cardData: any) {
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
        concepts: cardData.concepts,
        facts: cardData.facts,
        explanation: cardData.card_content.explanation,
      };

      return this._validateMatch(matchCard);
    } catch (e) {
      return null;
    }
  }

  _generateMatchCardDisplayTitle(answers: any) {
    let titles: string[] = [];
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

  _parseMatchContent = (input: InputItem[]): OutputItem[] => {
    const grouped = input.reduce<Record<string, OutputItem>>(
      (acc, { left_item, right_item }) => {
        if (!acc[left_item]) {
          acc[left_item] = { left_item, right_item: [] };
        }
        acc[left_item].right_item.push(right_item);
        return acc;
      },
      {}
    );

    return Object.values(grouped);
  };

  _validateMatch(matchCard: any) {
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
      } else {
        throw Error("Invalid content");
      }
      return matchCard;
    } catch (e) {
      return null;
    }
  }
}
