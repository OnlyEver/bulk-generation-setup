import { getDbInstance } from "../../app";
import { convertParsedArrayToDbOperations } from "./prepare-ops/parsed_response_to_db_operations";

export async function handleBulkWrite(parsedResponse: ParsedResponse[]) {
  try {
    const database = getDbInstance();
    const cardCollection = database.collection("_cards");
    const sourceCollection = database.collection("_source");
    const dbOps = await convertParsedArrayToDbOperations(parsedResponse);
    const cardsOps = dbOps._cards;
    const sourceOps = dbOps._source;
    if (cardsOps.length > 0) {
      await cardCollection.bulkWrite(cardsOps);
    }
    if (sourceOps.length > 0) {
      await sourceCollection.bulkWrite(sourceOps);
    }
  } catch (e: any) {
    console.error(
      "Error occurred while converting the parsed array to db operations:",
      e
    );
    throw e;
  }
}
