export function parseCardGenResponse(
  generatedData: any,
  isGapFill: boolean,
  headings: Array<any>
) {
  // let usage_data = generatedData.metadata;
  // const status_code = generatedData.status_code;
  try {
    const cardData = [];
    const unparsedTestCards = generatedData["test_cards"];
    const type = generatedData.type;
    if (unparsedTestCards !== undefined && unparsedTestCards.length != 0) {
      for (let elem of unparsedTestCards) {
        // if(headings.includes(elem.card_reference)){

        // }else{
        //   elem.card_reference = '';
        // }
        if (elem.type == "flash") {
          cardData.push(_parseFlashCard(elem));
        } else if (elem.type == "mcq") {
          cardData.push(_parseMcqCard(elem));
        } else if (elem.type == "cloze") {
          cardData.push(_parseClozeCard(elem));
        } else if (elem.type == "match") {
          cardData.push(_parseMatchCard(elem));
        }
      }
    } else {
      if (!isGapFill) {
        // usage_data.status = "failed";
      }
    }

    return {
      status_code: 200,
      // metadata: usage_data,
      type: type,
      missing_concepts: [],
      missing_facts: [],
      cards_data: cardData,
    };
  } catch (e: any) {
    // new ErrorLogger({
    //     "type": 'card_parsing',
    //     "data": e.message,
    //     "response": generatedData,
    // }).log();
    return {
      status_code: 500,
      // metadata: usage_data,
      type: generatedData.type,
    };

    //  return {
    //   status_code: 500,
    //   type: 'card_gen',
    //  }
  }
}

function _parseFlashCard(data: any) {
  let displayTitle = _generateFlashCardDisplayTitle(
    data.card_content.front,
    data.card_content.back
  );
  let flashCardData = {
    type: {
      category: "learning",
      sub_type: data.type,
    },
    heading: data.card_reference,
    displayTitle: displayTitle,
    content: {
      front_content: data.card_content.front,
      back_content: data.card_content.back,
    },
    concepts: data.concepts,
    facts: data.facts,
    bloomLevel: data.bloom_level,
  };

  return flashCardData;
}

function _generateFlashCardDisplayTitle(front: string, back: string) {
  return `${front} ---- ${back}`;
}

function _parseMcqCard(data: any) {
  let mcqAnswers = [];
  if (
    data.card_content.choices !== undefined &&
    data.card_content.choices.length != 0
  ) {
    for (let choice of data.card_content.choices) {
      let answer = {
        answer: choice.choice,
        is_correct: choice.is_correct,
      };
      mcqAnswers.push(answer);
    }
  }

  let displayTitle = _generateMcqCardDisplayTitle(
    data.card_content.prompt,
    mcqAnswers
  );
  let mcqCard = {
    type: {
      category: "learning",
      sub_type: data.type,
    },
    heading: data.card_reference,
    displayTitle: displayTitle,
    content: {
      question: data.card_content.prompt,
      answers: mcqAnswers,
    },
    concepts: data.concepts,
    facts: data.facts,
    bloomLevel: data.bloom_level,
  };
  return mcqCard;
}

function _generateMcqCardDisplayTitle(question: string, answers: any) {
  let answersString = [];
  if (answers.length != 0) {
    for (let option of answers) {
      let currentIndex = answers.indexOf(option) + 1;
      let temp = `${currentIndex} . ${option.answer} `;
      answersString.push(temp);
    }
    let resultString = answersString.join("");
    let finalDisplayTitle = `${question} ---- ${resultString}`;
    return finalDisplayTitle;
  } else {
    return question;
  }
}

function _parseClozeCard(data: any) {
  let displayTitle = _generateClozeCardDisplayTitle(
    data.card_content.prompt,
    data.card_content.options
  );
  let clozeCardData = {
    type: {
      category: "learning",
      sub_type: data.type,
    },
    heading: data.card_reference,
    displayTitle: displayTitle,
    content: {
      question: data.card_content.prompt,
      options: data.card_content.options,
    },
    concepts: data.concepts,
    facts: data.facts,
    bloomLevel: data.bloom_level,
  };

  return clozeCardData;
}

function _generateClozeCardDisplayTitle(question: string, answers: Array<any>) {
  let optionsString = "";
  if (answers.length !== 0) {
    optionsString = answers
      .map((item: { option: any }) => {
        if (item.option !== undefined) {
          return item.option;
        } else {
          return "";
        }
      })
      .join(", ");
  }

  return `${question} ---- ${optionsString}`;
}

function _parseMatchCard(cardData: any) {
  let content = cardData.card_content;

  let displayTitle = _generateMatchCardDisplayTitle(content);
  let matchCard = {
    type: {
      category: "learning",
      sub_type: cardData.type,
    },
    heading: cardData.card_reference,
    content: content,
    //  content: cardData.card_content,
    displayTitle: displayTitle,
    concepts: cardData.concepts,
    facts: cardData.facts,
    bloomLevel: cardData.bloom_level,
  };

  return matchCard;
}

function _generateMatchCardDisplayTitle(answers: any) {
  let titles: string[] = [];
  let counter = 65;
  for (let data of answers) {
    let value = data.right_item.join(",");
    let leftData = data.left_item;
    let letter = String.fromCharCode(counter);
    titles.push(`${letter}. ${leftData} -- ${value}`);
    counter++;
  }
  let displayTitle = titles.join(",");
  return displayTitle;
}
