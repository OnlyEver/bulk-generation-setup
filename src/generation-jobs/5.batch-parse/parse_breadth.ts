import { parseFields } from "../../utils/parse_typology";

/**
 *
 * For parsing the breadth or typology
 *
 * @param {RawResponse} rawResponse from batch response
 * @returns {ParsedResponse}
 */
export function parseBreadth(rawResponse: RawResponse): ParsedResponse {
  try {
    const requestId = rawResponse.request_id;
    const content = rawResponse.response.body.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    const usage = rawResponse.response.body.usage;
    const concepts = parsedContent.concepts.map(
      (concept: { concept_text: string; reference: string }) => ({
        concept_text: concept.concept_text,
        reference: concept.reference,
        type: "concept",
      })
    );

    const facts = parsedContent.facts.map(
      (fact: { fact_text: string; reference: string }) => ({
        concept_text: fact.fact_text,
        reference: fact.reference,
        type: "fact",
      })
    );
    const mixedConcepts = [...concepts, ...facts];
    return {
      requestIdentifier: requestId,
      generated_data: {
        field: parseFields(parsedContent.field),
        concepts: mixedConcepts,

        generate_cards: {
          state: parsedContent.generate_cards.state,
          reason: parsedContent.generate_cards.reason,
        },
        summary_cards: parsedContent.summary_cards,
      },
      metadata: {
        req_type: requestId.request_type,
        req_time: new Date(),
        req_tokens: usage?.prompt_tokens,
        res_tokens: usage?.completion_tokens,
        model: "gpt-4o-mini",
        status: "completed",
      },
    };
  } catch (error) {
    console.error("Error occurred while parsing breadth:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse breadth: ${errorMessage}`);
  }
}
