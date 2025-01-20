import { BSON } from "mongodb";
import { getDbInstance } from "../../app";
import { parseDepth } from "./parse_depth";
import { parseBreadth } from "./parse_breadth";

export async function parseResponse(generatedResponses: any[]) {
  try {
    const parsedData: ParsedResponse[] = [];
    const db = getDbInstance();
    const sourceCollection = db.collection("_source");
    for (const elem of generatedResponses) {
      const customId = extractCustomId(elem.custom_id);
      const rawResponse: RawResponse = {
        batch_id: elem.id,
        request_id: elem.response.request_id,
        response: elem.response,
      };

      if (customId.request_type.type === "depth") {
        const taxonomyData = await sourceCollection.findOne(
          {
            _id: new BSON.ObjectId(customId.source_id),
          },
          {
            projection: { source_taxonomy: 1 },
          }
        );
        const rawResponse: RawResponse = {
          batch_id: elem.id,
          request_id: customId,
          response: elem.response.body,
        };
        const parsedData = parseDepth({
          rawResponse: rawResponse,
          sourceTaxonomy: taxonomyData?.source_taxonomy ?? {},
        });
      } else if (customId.request_type.type === "breadth") {
        // handle typology parsing
        const parsedBreadth = parseBreadth(rawResponse);
        parsedData.push(parsedBreadth);
      }
    }
    return parsedData;
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
