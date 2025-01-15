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
export async function prepareBatch() {
  try {
    const db = database();
    const generationDataCollection = db.collection('_generation_data');

    let docs = await generationDataCollection.find({}).toArray();

    let sources = await fetchSourceDocuments(docs, db);

    const customId = (doc: any) => {
      return JSON.stringify({
        // id: doc._id.toString(),
        id: doc.source._id.toString(),
        // type: "typology",
        type: doc.type,
        bloom_level: 1,
      });
    };
    /// aasti ko json bata, which prompts to fetch evaluate, and get those prompts.

    console.log(docs);

    const batchData = await Promise.all(
      sources.map(async (doc: any) => ({
        custom_id: customId(doc), // Unique identifier for each request.
        method: "POST",
        url: "/v1/chat/completions", // API endpoint.
        body: {
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: await getPrompt(doc.type) },
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
      }))
    );

    console.log(batchData);

    // Write the batch data to a local file
    const filePath = "./batchinput.jsonl";
    await fsPromise.writeFile(
      filePath,
      batchData.map((entry) => JSON.stringify(entry)).join("\n"),
      "utf-8"
    );
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

export const fetchSourceDocuments = async (docs: any[], db: Db) => {
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
