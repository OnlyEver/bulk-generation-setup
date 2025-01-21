import { writeDBOpsForBreadth } from "./breadth_prepare";
import { writeDBOpsForDepth } from "./prepare_db_ops_for_depth";

export async function convertParsedArrayToDbOperations(
  parsedArray: ParsedResponse[]
): Promise<{
  _cards: any[];
  _source: any[];
}> {
  try {
    const dbOperations: any[] = [];

    for (const elem of parsedArray) {
      const reqId = elem.requestIdentifier;
      const reqType = reqId.request_type;
      if (reqType.type === "breadth") {
        // to add to set for concepts,facts,
        // write to generation_info for source
        const dbOps = writeDBOpsForBreadth(elem);
        dbOperations.push(...dbOps);
      } else if (reqType.type === "depth") {
        // to add to set for _ai_Cards
        // create _cards objects and write to _cards
        // write to generation_info for source

        const dbOps = await writeDBOpsForDepth(elem);
        dbOperations.push(...dbOps);
      }
    }
    return {
      _cards: dbOperations
        .filter((elem) => elem.collection === "_cards")
        .map((elem) => elem.query),
      _source: dbOperations
        .filter((elem) => elem.collection === "_source")
        .map((elem) => elem.query),
    };
  } catch (e: any) {
    console.error(
      "Error occurred while converting the parsed array to db operations:",
      e
    );
    throw e;
  }
}
