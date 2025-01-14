import fsPromise from "fs/promises";

import { sourceCollection } from "../../mongodb/connection";
import { returnTypologyPrompt } from "../1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "../1.batch-prepare/parse_source_content";

/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export async function prepareBatch() {
  try {
    let docs = await sourceCollection.find({}).toArray();
    const customId = (doc: any) => {
      return JSON.stringify({
        id: doc._id.toString(),
        type: "typology",
        bloom_level: 1,
      });
    };
    /// aasti ko json bata, which prompts to fetch evaluate, and get those prompts.

    console.log(docs);

    const batchData = docs.map((doc: any, index: number) => ({
      custom_id: customId(doc), // Unique identifier for each request.
      method: "POST",
      url: "/v1/chat/completions", // API endpoint.
      body: {
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: returnTypologyPrompt() },
          {
            role: "user",
            content: parseData(
              doc.content,
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
          }, // User message (use doc content or default).
        ],
      },
    }));
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
