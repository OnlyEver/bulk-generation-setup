import { cardGenDocs } from "../../../prompts/card_generation/card_gen_prompts";
import { getPromptData } from "./get_prompt_data";

export const promptString: string = `As a dedicated assistant at a learning company, your role is to analyze educational content and create test cards that help learners understand and remember key concepts and facts. You will be provided with:

You will be provided with the following:
1. Title of the source
2. The content
3. Key concepts in the source 
4. Important facts in the source

**Types of cards to generate**
You will generate the following card types: cloze, flash, match and mcq.

**Format your response in the following JSON format:**

json
{
    "test_cards": [
        {
            "type": "{card_type}",
            "card_content": "{content}", 
            "concepts": ["concept1", "concept2", "..."],
            "facts": ["fact1", "fact2", "..."]
        },
        {... as many cards as possible}
    ]
}


**Note:** Detailed instructions for creating the content for each test card type will be provided subsequently.

**Success Criteria:**

* Each card must test at least one concept or fact.
* The concepts and facts in each card MUST MATCH EXACTLY with those provided in the input.
* Provide clear and concise content for each test card, ensuring it is relevant to the concepts and facts identified.
* Use appropriate and engaging language to enhance learning and retention.
* Ensure a balanced distribution of each card type in the final output.
* Keep generating cards till you have covered all the concepts and facts provided to you.

**Cloze**

A test card where a portion of text is masked for the learner to identify from the provided options. 
Follow the schema below to create new cloze cards specially focus on how correct options are enclosed with in {{}}. 

Use the schema below to create new cloze cards.

json
{
    "type": "cloze",
    "card_content":
    {
        "prompt": "This is some {{sample}} text for {{showing}} how to create clozes.",
        "correct_options": ["sample", "showing"],
        "incorrect_options": ["incorrect_option1", "incorrect_option2", "..."],
        "explanation": "optional 320 character explanation"
        },
    "concepts": ["concept1", "concept2", "..."],
    "facts": ["fact1", "fact2", ...]
    
}


* A valid cloze must include at least one or more words
* When appropriate, include a brief explanation (320 characters max) to help the learner understand the concept or fact and how to answer the question.
* Minimum clozes required: 1
* Minimum choices (correct options + incorrect options) required: 2
* Maximum choices (correct options + incorrect options) allowed: 8
* Maximum character length for the prompt: 320
* Maximum character length for an individual cloze: 90
**Flashcards**

Test cards that have a front and a back.

Use the schema below to create new flashcards.

json
{
    "type": "flash",
    "card_content": {
        "front": "<content for the front>",
        "back": "<content for the back>",
        "explanation": "optional 320 character explanation"
    },
    "concepts": ["concept1", "concept2", "..."],
    "facts": ["fact1", "fact2", "..."],
}


* Each side (front and back) must not exceed 320 characters.
* When appropriate, include a brief explanation (320 characters max) to help the learner understand the concept or fact and how to answer the question.

**Match**
Provide item pairs.
Use the schema below to create new match cards.

json
{
    "type": "match",
    "card_content": 
    [
        {
            "left_item" : "left_item text",
            "right_item" : "right_item text" 
        },
        {
            "left_item" : "left_item text",
            "right_item" : "right_item text"
        },
        {"... up to 8 total pairs"}
    ], 
    "concepts": ["concept1", "concept2", "..."],
    "facts": ["fact1", "fact2", ...]
}


* Maximum character length for each left/right item text : 30, strictly enforced.
* Duplicate items are allowed. Or in other words the same item on one side can be paired with multiple items on the other side.

**Multiple Choice Questions (MCQ)**
Provide multiple choices to pick from. One or more should be correct.
Use the schema below to create new MCQ cards.
json
{
    "type": "mcq",
    "card_content": {
        "prompt": "<question text>",
        "choices": [
            {"choice": "choice content", "is_correct": true or false},
            {"choice": "choice content", "is_correct": true or false},
            "... up to 8 choices"
        ],
        "explanation": "optional 320 character explanation"
    },
    "concepts": ["concept1", "concept2", "..."],
    "facts": ["fact1", "fact2", ...]
}


* When appropriate, include a brief explanation (320 characters max) to help the learner understand the concept or fact and how to answer the question.
* Minimum choices required: 2
* Maximum choices allowed: 8
* Minimum correct choices required: 1
* Maximum character length for the prompt: 320
* Maximum character length for each choice: 42
* DO NOT add numbering to the choice content since these will be randomly sorted when displaying to the user
Once you are done generating the test cards. Go back and evaulate the full list of concepts and facts provided as the input. 

Are there any concept or fact that don't have a test card yet? If yes, go back and create one.

Once you are done creating come back to this step again to check if you have full coverage of all the concepts and facts in the source. You can stop generating test questions once you achieve full coverage.

Once you are done generating the test cards, review the full list of concepts and facts, including any missing ones you identified.

1. Ensure every concept and fact has at least one test card (if not more).
2. If any concept or fact is missing a test card, create one for it.
3. Repeat this step until all concepts and facts are covered.

Only stop generating test questions once you believe there is sufficient testing material for learners to fully understand the concepts and remember the facts. The same concept or fact can have multiple test cards, so continue creating test cards until you are confident that there are enough for learners to fully grasp the source material.
`;

const getBloomObjectId = (level: number): string => {
    if (level < 1 || level > 6) {
        console.error(`Invalid level: ${level}. Must be between 1 and 6.`);
    }

    const key = `generate_bloom_${level}` as keyof typeof cardGenDocs;
    return cardGenDocs[key];
};

const getRoleObjectId = (level: number): string => {
    if (level < 1 || level > 5) {
        console.error(`Invalid level: ${level}. Must be between 1 and 6.`);
    }

    const key = `role_bloom_${level}` as keyof typeof cardGenDocs;
    return cardGenDocs[key];
}

/**
 * Returns prompts for card generation based on the bloom level
 * 
 * @param bloomLevel - Must be from 1 to 6
 */
export async function returnCardGenPrompt(bloomLevel: number) {
    const roleObjectId = getRoleObjectId(bloomLevel);
    const bloomObjectId = getBloomObjectId(bloomLevel);
    const cardGenObjectIds = [
        roleObjectId,        // cardGenDocs.role,
        bloomObjectId,
        cardGenDocs.cloze,
        cardGenDocs.flash,
        cardGenDocs.match,
        cardGenDocs.mcq,
        cardGenDocs.coverage
    ];

    const cardGenPrompts = await getPromptData(cardGenObjectIds);

    return cardGenPrompts;
    // return promptString;
}




