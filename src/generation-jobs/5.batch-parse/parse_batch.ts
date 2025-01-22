import { BSON, ObjectId } from "mongodb";
import { getDbInstance } from "../../app";
import { parseDepth } from "./parse_depth";
import { parseBreadth } from "./parse_breadth";

export async function parseBatchResponse(generatedResponses: any[]): Promise<{
  batch_id: string;
  parsed_response: ParsedResponse[];
}> {
  try {
    const parsedData: ParsedResponse[] = [];
    const db = getDbInstance();
    const sourceCollection = db.collection("_source");
    var batchId = "";
    for (const elem of generatedResponses) {
      const customId = extractCustomId(elem.custom_id);
      batchId = elem.id;
      const rawResponse: RawResponse = {
        batch_id: elem.id,
        request_id: customId,
        response: elem.response,
      };

      if (customId.request_type.type === "depth") {
        const taxonomyData = await sourceCollection.findOne(
          {
            _id: new ObjectId(customId._source),
          },
          {
            projection: { source_taxonomy: 1 },
          }
        );

        const depth = parseDepth({
          rawResponse: rawResponse,
          sourceTaxonomy: taxonomyData?.source_taxonomy ?? {},
        });
        parsedData.push(depth);
      } else if (customId.request_type.type === "breadth") {
        // handle typology parsing
        const parsedBreadth = parseBreadth(rawResponse);
        parsedData.push(parsedBreadth);
      }
    }
    return {
      batch_id: batchId,
      parsed_response: parsedData,
    };
  } catch (e: any) {
    throw Error(e.message);
  }
}

function extractCustomId(customId: string): RequestId {
  const customIdData = JSON.parse(customId);
  return {
    _source: customIdData.source_id,
    request_type: {
      type: customIdData.request_type.type,
      bloom_level: customIdData.request_type.bloom_level,
      n: customIdData.request,
    },
  };
}
