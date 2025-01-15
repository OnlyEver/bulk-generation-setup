import fsPromise from "fs/promises";

import { database } from "../../mongodb/connection";
import { returnTypologyPrompt } from "./fetch-prompts/fetch_typology_prompt";
import { parseData } from "../1.batch-prepare/parse_source_content";
import { BSON, WithId } from "mongodb";
import { parseTypologyOnSuccess } from "../../utils/parse_typology";
import { insertSourceTypology } from "../../mongodb/insert";
import { returnCardGenPrompt } from "./fetch-prompts/fetch_card_gen_prompt";

/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export async function prepareBatchForCard(
  response: any[],
  docs: WithId<BSON.Document>[]
) {
  try {
    var sourceId: any = "";
    const cardGenBatchData = await Promise.all(
      response.map(async (batchResponse: any, index) => {
        const body = batchResponse["response"]["body"];
        const content = body.choices[0]["message"]["content"];
        const parsedContent = JSON.parse(content);
        // console.log(batchResponse);
        // console.log(parsedContent);
        const parsedTypology = parseTypologyOnSuccess(parsedContent);
        // console.log(parsedTypology);
        const customId = JSON.parse(batchResponse["custom_id"]);
        sourceId = customId["id"];
        await insertSourceTypology(parsedTypology, sourceId);
        const sourceContent = docs.find((doc) => doc._id == sourceId);
        return {
          custom_id: JSON.stringify({
            id: index,
            type: "card_gen",
            bloom_level: 1,
          }), // Unique identifier for each request.
          method: "POST", // HTTP method.
          url: "/v1/chat/completions", // API endpoint.
          body: {
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }, // Specify the model.
            messages: [
              { role: "system", content: returnCardGenPrompt(1) }, // System message.
              {
                role: "user",
                content:
                  JSON.stringify(parsedTypology) +
                  parseData(
                    sourceContent!.content,
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
        };
      })
    );
    const cardGenFileData = "./batchinputForCardGen.jsonl";
    await fsPromise.writeFile(
      cardGenFileData,
      cardGenBatchData.map((entry) => JSON.stringify(entry)).join("\n"),
      "utf-8"
    );
    return sourceId;
  } catch (error) {
    console.error("Error occurred while preparing the batch file:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to prepare batch file: ${errorMessage}`);
  }
}
