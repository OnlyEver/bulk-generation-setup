import fsPromise from "fs/promises";

import { database } from "../../mongodb/connection";
import { returnTypologyPrompt } from "../1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "../1.batch-prepare/parse_source_content";
import { Db, ObjectId } from "mongodb";
import { returnCardGenPrompt } from "./fetch-prompts/card_gen_prompt";

/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export async function prepareBatch(): Promise<string> {
  try {
    const generationDataCollection = database.collection('_generation_data');
    let docs = await generationDataCollection.find({}).toArray();
    let sources = await fetchSourceDocuments(docs, database);
    const batchData = await Promise.all(
      sources.map(async (doc: any) => {
        if (doc.type == 'typology') {
          await prepareBatchForBreadth(doc);
        } else {
          await prepareBatchForDepth(doc);
        }
      })
    );


    // Write the batch data to a local file
    const filePath = "./batchinput.jsonl";
    await fsPromise.writeFile(
      filePath,
      batchData.map((entry) => JSON.stringify(entry)).join("\n"),
      "utf-8"
    );

    return filePath;
  } catch (error) {
    console.error("Error occurred while preparing the batch file:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to prepare batch file: ${errorMessage}`);
  }
}

const getPrompt = async (type: string): Promise<string> => {
  switch (type) {
    case "typology":
      return await returnTypologyPrompt();
    case "card":
      return returnCardGenPrompt();
    default:
      return await returnTypologyPrompt();
  }
}

const getCustomIdForBreadth = (doc: any) => ({
  return: JSON.stringify({
    id: doc.source._id.toString(),
    type: doc.type,
    bloom_level: 1,
  })
})
const getCustomIdForDepth = (doc: any) => ({
  //return custom id for depth


  // return: JSON.stringify({
  //   id: doc.source._id.toString(),
  //   type: doc.type,
  //   bloom_level: 1,
  // })
})

const getBatchDataForBreadth = (content: string) => {

}
const getBatchDataForDepth = (content: string) => {

}

const prepareBatchForBreadth = async (doc: any,) => {
  const prompts = await getPrompt(doc.type);
  return {
    custom_id: getCustomIdForBreadth(doc), // Unique identifier for each request.
    method: "POST",
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompts },
        {
          role: "user",
          content: parseData(
            doc.source.content,
            [
              "See also",
              "References",
              "Further reading",
              "External links",
              "Notes and references",
              "Bibliography",
              "Notes",
              "Cited sources",
            ],
            ["table", "empty_line"]
          ),
        },
      ],
    },
  }


}
const prepareBatchForDepth = async (doc: any) => {
  //return map data for depth
  return {}
}

const fetchSourceDocuments = async (docs: any[], db: Db) => {
  const sourceCollection = db.collection('_source');

  const sourceDocs = await Promise.all(
    docs.map(async (doc) => {
      const sourceId = doc._source;


      // Convert the string _source to ObjectId
      const sourceObjectId = ObjectId.createFromHexString(sourceId);

      // Fetch the document from '_source' collection
      const source = await sourceCollection.findOne({ _id: sourceObjectId });

      return {
        ...doc,
        source: source,
      };
    })
  );

  return sourceDocs;
}
