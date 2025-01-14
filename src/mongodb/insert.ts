import { ObjectId } from "mongodb";
import { database } from "./connection";

export type Card = {
  id: ObjectId;
  heading?: string;
  content: Object;
  concepts: Array<any>;
  facts: Array<any>;
  bloomlevel: any;
  displayTitle?: string;
};

export async function insertSourceTypology(
  parsedTypology: Object,
  sourceId: string
) {
  const typologyCollection = database().collection("typology");
  console.log("Inserting typology");
  console.log(parsedTypology);
  const doc = {
    _source_id: sourceId,
    typology: parsedTypology,
  };
  const result = await typologyCollection.insertOne(doc);
  console.log(result);
}

export async function insertCard(parsedCardData: Card, sourceId: string) {
  console.log("Inserting card data");
  const cardCollection = database().collection("_card");
  const doc = {
    _source_id: sourceId,
    content: parsedCardData.content,
    concepts: parsedCardData.concepts,
    facts: parsedCardData.facts,
    display_title: parsedCardData.displayTitle,
    bloom_level: parsedCardData.bloomlevel,
    heading: parsedCardData.heading,
  };
  const result = await cardCollection.insertOne(doc);
  console.log(result);
}
