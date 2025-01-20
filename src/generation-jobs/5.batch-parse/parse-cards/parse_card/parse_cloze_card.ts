export class ParseClozeCard {
  parse(data: any) {
    try {
      const content = data.card_content;
      let correctOptions = content.correct_options;
      let incorrectOptions = content.incorrect_options;
      let allOptions = [...correctOptions, ...incorrectOptions];
      let displayTitle = this._generateClozeCardDisplayTitle(
        data.card_content.prompt,
        allOptions
      );
      let preparedData = this._prepareQuestionAndCorrectAnswers(
        content.prompt,
        correctOptions
      );
      let finalQuestion = preparedData.prompt;
      let parsedCorrectOptions = preparedData.options;
      let parsedIncorrectoptions = incorrectOptions.map((e: any) => {
        return {
          option: e,
          cloze: "null",
        };
      });
      const finalParsedOptions = [
        ...parsedCorrectOptions,
        ...parsedIncorrectoptions,
      ];
      let clozeCardData = {
        type: {
          category: "learning",
          sub_type: data.type,
        },
        heading: "",
        displayTitle: displayTitle,
        content: {
          question: finalQuestion,
          options: finalParsedOptions,
        },
        concepts: data.concepts,
        facts: data.facts,
        explanation: data.card_content.explanation,
      };

      return this._validateCloze(clozeCardData);
    } catch (e) {
      return null;
    }
  }

  _generateClozeCardDisplayTitle(question: string, answers: Array<any>) {
    try {
      let optionsString = "";
      if (answers.length !== 0) {
        optionsString = answers.join(", ");
      }

      return `${question} ---- ${optionsString}`;
    } catch (e) {
      throw Error("Error in generating display title");
    }
  }

  /// validate the cloze card
  // 1. Has Empty cloze
  // 2. has Duplicate Clozes
  // 3. doesnt have any valid option,
  // 4. Question length 320
  // 5. More than 6 options
  // 6. Less than 2 options
  // 7. Max character for individual cloze: 90

  _prepareQuestionAndCorrectAnswers(
    rawPrompt: String,
    correctOptions: Array<any>
  ) {
    try {
      var finalCorrectOptions = <any>[];
      const regex = /{{(.*?)}}/g;

      const transformed = rawPrompt.replace(regex, (match, p1) => {
        // p1 is the captured group inside {{ }} (e.g., "fruit", "green")
        const idx = correctOptions.indexOf(p1);
        if (idx !== -1) {
          let cloze = `c${idx}`;
          finalCorrectOptions.push({
            option: p1,
            cloze: cloze,
          });
          return `{{c${idx}:${p1}}}`;
        }
        return match; // If not found in correct_options, leave as is or handle accordingly
      });
      return {
        prompt: transformed,
        options: finalCorrectOptions,
      };
    } catch (e) {
      throw Error("Error in preparing question and correct answers");
    }
  }

  _validateCloze(clozeCard: any) {
    let clozeRegex = /\{\{c(\d+):([^}]+)\}\}/g;

    try {
      /// validate emptu cloze
      let options = clozeCard.content.options ?? [];
      let question = clozeCard.content.question;
      if (options.length < 2 || options.length > 6) {
        throw Error("Number of cloze options are invalid");
      }

      /// There are no correct clozes// or null cloze or empty cloze
      let correctOptions = options.find(
        (e: any) => e.cloze != "null" && e.cloze != null && e.cloze.trim() != ""
      );
      if (correctOptions) {
      } else {
        throw Error(" No valid clozes exists");
      }

      let rightClozes = options.filter((e: any) => e.cloze.startsWith("c"));

      /// matches our cloze syntax
      let clozeMatches = [...question.matchAll(clozeRegex)];
      if (clozeMatches.length == 0) {
        throw Error("Question Invalid");
      } else if (clozeMatches.length != rightClozes.length) {
        throw Error(" Clozes in question doesnt match to clozes in options");
      }
      return clozeCard;
    } catch (e: any) {
      throw Error(`Error in validating cloze card ${e.message}`);
    }
  }
}
