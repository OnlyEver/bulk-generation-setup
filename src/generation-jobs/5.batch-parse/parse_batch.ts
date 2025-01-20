import { parseBreadth } from "./parse_breadth";

export async function parseResponse(generatedResponses: any[]) {
  try {
    // const parsedResponses = await Promise.all(
    //   generatedResponse.map(async (response) => {
    //     const body = response["response"]["body"];
    //     const content = body.choices[0]["message"]["content"];
    //     const parsedContent = JSON.parse(content);
    //     return parsedContent;
    //   })
    // );
    // return parsedResponses;
    for (const elem of generatedResponses) {
      const customId = extractCustomId(elem.custom_id);
      const rawResponse: RawResponse = {
        batch_id: elem.id,
        request_id: elem.response.request_id,
        response: elem.response
      };

      if (customId.request_type.type === "depth") {
        // handle card  parsing
      } else if (customId.request_type.type === "breadth") {
        // handle typology parsing
        const parsedBreadth = parseBreadth(rawResponse);
        return parsedBreadth;
      }
    }
  } catch (e: any) {
    throw Error(e.message);
  }
}

function extractCustomId(customId: string): RequestId {
  const customIdData = JSON.parse(customId);
  return {
    source_id: customIdData.source_id,
    request_type: {
      type: customIdData.request_type.type,
      bloom_level: customIdData.request_type.bloom_level,
      n: customIdData.request,
    },
  };
}
