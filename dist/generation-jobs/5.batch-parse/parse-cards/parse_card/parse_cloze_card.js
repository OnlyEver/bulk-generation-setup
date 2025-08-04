"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseClozeCard = void 0;
class ParseClozeCard {
    parse(data) {
        try {
            const content = data.card_content;
            let correctOptions = content.correct_options;
            let incorrectOptions = content.incorrect_options;
            let allOptions = [...correctOptions, ...incorrectOptions];
            let displayTitle = this._generateClozeCardDisplayTitle(data.card_content.prompt, allOptions);
            let preparedData = this._prepareQuestionAndCorrectAnswers(content.prompt, correctOptions);
            let finalQuestion = preparedData.prompt;
            let parsedCorrectOptions = preparedData.options;
            let parsedIncorrectoptions = incorrectOptions.map((e) => {
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
                concepts_facts: data.concepts_facts,
                explanation: data.card_content.explanation,
                bloom_level: data.bloom_level,
            };
            return this._validateCloze(clozeCardData);
        }
        catch (e) {
            return null;
        }
    }
    _generateClozeCardDisplayTitle(question, answers) {
        try {
            let optionsString = "";
            if (answers.length !== 0) {
                optionsString = answers.join(", ");
            }
            return `${question} ---- ${optionsString}`;
        }
        catch (e) {
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
    _prepareQuestionAndCorrectAnswers(rawPrompt, correctOptions) {
        try {
            var finalCorrectOptions = [];
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
        }
        catch (e) {
            throw Error("Error in preparing question and correct answers");
        }
    }
    _validateCloze(clozeCard) {
        var _a;
        let clozeRegex = /\{\{c(\d+):([^}]+)\}\}/g;
        try {
            /// validate emptu cloze
            let options = (_a = clozeCard.content.options) !== null && _a !== void 0 ? _a : [];
            let question = clozeCard.content.question;
            if (options.length < 2 || options.length > 6) {
                throw Error("Number of cloze options are invalid");
            }
            /// There are no correct clozes// or null cloze or empty cloze
            let correctOptions = options.find((e) => e.cloze != "null" && e.cloze != null && e.cloze.trim() != "");
            if (correctOptions) {
            }
            else {
                throw Error(" No valid clozes exists");
            }
            let rightClozes = options.filter((e) => e.cloze.startsWith("c"));
            /// matches our cloze syntax
            let clozeMatches = [...question.matchAll(clozeRegex)];
            if (clozeMatches.length == 0) {
                throw Error("Question Invalid");
            }
            else if (clozeMatches.length != rightClozes.length) {
                throw Error(" Clozes in question doesnt match to clozes in options");
            }
            return clozeCard;
        }
        catch (e) {
            throw Error(`Error in validating cloze card ${e.message}`);
        }
    }
}
exports.ParseClozeCard = ParseClozeCard;
//# sourceMappingURL=parse_cloze_card.js.map