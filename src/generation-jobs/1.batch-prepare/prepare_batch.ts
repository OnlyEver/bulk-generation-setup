import fsPromise from "fs/promises";

import { database } from "../../mongodb/connection";
import { returnTypologyPrompt } from "./fetch-prompts/fetch_typology_prompt";
import { parseData } from "../1.batch-prepare/parse_source_content";
import { Db, ObjectId } from "mongodb";
import { returnCardGenPrompt } from "./fetch-prompts/fetch_card_gen_prompt";
import { parse } from "path";

/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export async function prepareBatch(model: string): Promise<{
  sources: any[];
  inputFileList: string[];
}> {
  try {
    var inputFileList: string[] = [];
    let docs: any[] = [];
    let sourcesPerBatch = 100;
    // if (breadthGeneration) {
    //   docs = await filterDocsForBreadthGeneration();
    // } else {
    const generationDataCollection = database.collection(
      "_generation_requests"
    );

    docs = await generationDataCollection
      .find({ status: "created", 'request_type.type': { $ne: 'embedding' }, }).limit(400).toArray();




    let sources = await fetchSourceDocuments(docs);
    const result = [];

    for (let i = 0; i < sources.length; i += sourcesPerBatch) {
      // Slice the array into chunks of maxCount elements
      result.push(sources.slice(i, i + sourcesPerBatch));
    }

    await Promise.all(
      result.map(async (element, index) => {
        var batchDataList: any[] = [];
        await Promise.all(
          element.map(async (elem) => {
            if (elem.request_type.type === "breadth") {
              const batchData = await prepareBatchForBreadth(elem, model);
              batchDataList.push(batchData);
            } else {//update else if function
              const batchData = await prepareBatchForDepth(elem, model);
              batchDataList.push(batchData);
            }
          })
        );


        // const filePath = `/tmp/batchinput${index}.jsonl`;
        const filePath = `/tmp/batchinput${index}.jsonl`;
        await fsPromise.writeFile(
          filePath,
          batchDataList.map((entry) => JSON.stringify(entry)).join("\n"),
          "utf-8"
        );

        inputFileList.push(filePath);
      })
    );

    return {
      sources,
      inputFileList,
    };
  } catch (error) {
    console.error("Error occurred while preparing the batch file:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to prepare batch file: ${errorMessage}`);
  }
}

async function filterDocsForBreadthGeneration() {
  var idsToEscape = [];
  const generationDataCollection = database.collection(
    "_generation_requests"
  );
  const genDataDocs = await generationDataCollection
    .find()
    .toArray();
  idsToEscape = genDataDocs.map((doc) => doc._id);
  const sourceDataCollection = database.collection(
    "_source"
  );
  const docs = await sourceDataCollection
    .find({ $nin: idsToEscape })
    .toArray();
  return docs;
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

const getCustomIdForBreadth = (doc: any): RequestId => {
  return {
    _source: doc.source._id.toString(),
    request_type: {
      type: doc.request_type.type,
      n: doc.request_type?.n ?? 1,
    },
  };
};

const getCustomIdForDepth = (doc: any): RequestId => {
  return {
    _source: doc.source._id.toString(),
    request_type: {
      type: doc.request_type.type,
      n: doc.request_type?.n ?? 1,
      bloom_level: doc.request_type.bloom_level,
    },
  };
};

const prepareBatchForBreadth = async (doc: any, model: string) => {
  const prompts = await getPrompt(doc.request_type.type);
  const currentN = doc.request_type.n ?? 1;
  let existingTypology = "";
  if (currentN > 1) {
    existingTypology =
      "Dont generate Existing taxonomy data is as " +
      JSON.stringify(doc.source?.source_taxonomy ?? {});
  }
  return {
    custom_id: JSON.stringify(getCustomIdForBreadth(doc)), // Unique identifier for each request.
    method: "POST",
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompts },
        {
          role: "user",
          content:
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
            ) + existingTypology,
        },
      ],
    },
  };
};

const prepareBatchForDepth = async (doc: any, model: string) => {
  const parsedTypology = doc.source.source_taxonomy;
  const params = doc.params;
  const cardGenPrompt = await getPrompt(
    doc.request_type.type,
    doc.request_type.bloom_level
  );
  if (doc.request_type.bloom_level !== 1) {
    if (params) {
      if (params.missing_facts) {
        parsedTypology.facts = params.missing_facts;
      }
      if (params.missing_concepts) {
        parsedTypology.concepts = params.missing_concepts;
      }
    }
  }

  return {
    custom_id: JSON.stringify(getCustomIdForDepth(doc)),
    method: "POST", // HTTP method.
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: model,
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
