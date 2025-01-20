import fsPromise from "fs/promises";

import { database } from "../../mongodb/connection";
import { returnTypologyPrompt } from "./fetch-prompts/fetch_typology_prompt";
import { parseData } from "../1.batch-prepare/parse_source_content";
import { Db, ObjectId } from "mongodb";
import { returnCardGenPrompt } from "./fetch-prompts/fetch_card_gen_prompt";

/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export async function prepareBatch(): Promise<Object> {
  try {
    var inputFileList: string[] = [];
    const generationDataCollection = database.collection("_generation_data");
    let docs = await generationDataCollection.find({}).toArray();
    let sources = await fetchSourceDocuments(docs);
    const result = [];

    for (let i = 0; i < sources.length; i += 300) {
      // Slice the array into chunks of maxCount elements
      result.push(sources.slice(i, i + 300));
    }
    console.log(result);
    await Promise.all(
      result.map(async (element, index) => {
        const batchDataList: any[] = [];
        await Promise.all(
          element.map(async (elem) => {
            if (elem.request_type.type === "breadth") {
              const batchData = await prepareBatchForBreadth(elem);
              batchDataList.push(batchData);
            } else {
              const batchData = await prepareBatchForDepth(elem);
              batchDataList.push(batchData);
            }
          })
        );

        const filePath = `./batchinput${index}.jsonl`;
        await fsPromise.writeFile(
          filePath,
          batchDataList.map((entry) => JSON.stringify(entry)).join("\n"),
          "utf-8"
        );

        inputFileList.push(filePath);
      })
    );

    console.log(inputFileList);
    return {
      sources,
      inputFileList,
    };
    return inputFileList;
  } catch (error) {
    console.error("Error occurred while preparing the batch file:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to prepare batch file: ${errorMessage}`);
  }
}

const getPrompt = async (
  type: string,
  bloomLevel?: number
): Promise<string> => {
  switch (type) {
    case "breadth":
      return await returnTypologyPrompt();
    case "depth":
      return await returnCardGenPrompt(bloomLevel ?? 1);
    default:
      return await returnTypologyPrompt();
  }
};

const getCustomIdForBreadth = (doc: any) => {
  return JSON.stringify({
    source: doc.source._id.toString(),
    request_type: {
      type: doc.request_type.type,
      n: 1,
    },
  });
};
// {
//   "source": ObjectIDString,
//   "request_type": {
//   "type": "depth",
//   "n": 1
//   "bloom_level": 1 // specific for card generation
//   }
// }
const getCustomIdForDepth = (doc: any) => {
  return JSON.stringify({
    id: doc.index,
    source: doc.source._id.toString(),
    request_type: {
      type: doc.request_type.type,
      n: 1,
      bloom_level: doc.request_type.bloom_level,
    },
  })

};

const prepareBatchForBreadth = async (doc: any) => {
  const prompts = await getPrompt(doc.request_type.type);
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
  };
};

const prepareBatchForDepth = async (doc: any) => {
  // const parsedTypology = await _fetchTypologyDocuments(doc._source);
  const parsedTypology = doc._source.source_taxonomy;
  const cardGenPrompt = await getPrompt(doc.request_type.type, doc.request_type.bloom_level);

  return {
    custom_id: getCustomIdForDepth(doc),
    method: "POST", // HTTP method.
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // Specify the model.
      messages: [
        { role: "system", content: cardGenPrompt }, // System message.
        {
          role: "user",
          content:
            JSON.stringify(parsedTypology) +
            parseData(
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
        }, // User message (use doc content or default).
      ],
    },
  };
};

const fetchSourceDocuments = async (docs: any[]) => {
  const sourceCollection = database.collection("_source");

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
};
