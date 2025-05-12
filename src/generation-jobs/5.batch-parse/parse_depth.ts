import { getDbInstance } from "../../app";
import { ParseCardResponse } from "./parse-cards/parse_card_response";

import { getCardData } from "./temp_card_gen_data";

type parseDepth = {
  rawResponse: RawResponse;
  sourceTaxonomy: any;
};

export async function parseDepth(params: parseDepth): Promise<ParsedResponse> {
  try {
    const rawResponse = params.rawResponse;
    const requestId = rawResponse.request_id;
    const response = rawResponse.response.body;
    const usage = rawResponse.response.body.usage;
    const generatedData = JSON.parse(response.choices[0].message.content);
    const cardData = await new ParseCardResponse().parse(
      generatedData,
      (requestId.request_type?.n ?? 1) > 1,
      params.sourceTaxonomy,
      requestId.request_type?.bloom_level ?? 1
    );

    const cardResponse: CardGenResponse = {
      cards_data: cardData.cards_data ?? [],
      missing_facts: [],
      missing_concepts: [],
    };

    return {
      requestIdentifier: requestId,
      metadata: {
        req_type: requestId.request_type,
        req_time: new Date(),
        req_tokens: usage?.prompt_tokens,
        res_tokens: usage?.completion_tokens,
        model: "gpt-4o-mini",
        status: "completed",
      },
      generated_data: cardResponse,
    };
  } catch (e: any) {
    throw Error(e.message);
  }
}
