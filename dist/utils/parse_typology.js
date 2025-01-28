"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTypologyOnSuccess = parseTypologyOnSuccess;
exports.parseFields = parseFields;
function parseTypologyOnSuccess(responseData) {
    // responseData.metadata.status = "completed";
    const generatedContent = responseData;
    // console.log(generatedContent);
    return {
        status_code: 200,
        // metadata: responseData.metadata,
        field: parseFields(generatedContent.field),
        concepts: generatedContent.concepts,
        facts: generatedContent.facts,
        generate_cards: generatedContent.generate_cards,
        summary_cards: generatedContent.summary_cards,
        // type: responseData.type
    };
}
function parseFields(fields) {
    let expectedFields = [
        "Sciences",
        "Technology & Engineering",
        "Humanities & Cultural Studies",
        "Social Sciences & Global Studies",
        "Business & Management",
        "Health & Medicine",
        "Environmental Studies & Earth Sciences",
        "Education, Learning & Personal Development",
        "Creative & Performing Arts",
        "Law, Governance & Ethics",
        "Recreation, Lifestyle & Practical Skills",
        "Technology & Media Literacy",
        "Philosophy & Critical Thinking",
        "Space & Astronomical Sciences",
        "Agriculture & Food Sciences",
        "Trades & Craftsmanship",
        "Reference & Indexing",
        "Other",
    ];
    const fieldKeys = ["primary_field", "secondary_field", "tertiary_field"];
    return fields.slice(0, 3).map((item, index) => ({
        [fieldKeys[index]]: item,
        reconcile: !expectedFields.includes(item.toLowerCase()),
    }));
}
//# sourceMappingURL=parse_typology.js.map