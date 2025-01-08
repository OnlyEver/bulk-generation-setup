import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { returnTypologyPrompt } from "./1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "./1.batch-prepare/parse_source_content";
import { config } from "../config";
import { delay } from "../utils/delay_helper";

import { sourceCollection } from "../mongodb/connection";

import { prepareBatch } from "./2.batch-creation/create_batch";
import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { cancelBatch } from "./3.batch-status/cancel_batch";

export async function sendGeneration() {
  let docs = await sourceCollection.find({}).toArray();
  const customId = (doc: any) => {
    return JSON.stringify({
      id: doc._id.toString(),
      type: "typology",
      bloom_level: 1,
    });
  };

  const batchData = docs.map((doc, index) => ({
    custom_id: customId(doc), // Unique identifier for each request.
    method: "POST", // HTTP method.
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // Specify the model.
      messages: [
        { role: "system", content: returnTypologyPrompt() }, // System message.
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

  // Write the batch data to a local file
  const filePath = "./batchinputonl";
  await fsPromise.writeFile(
    filePath,
    batchData.map((entry) => JSON.stringify(entry)).join("\n"),
    "utf-8"
  );

  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputonl"),
    purpose: "batch",
  });

  const batch = await prepareBatch(file.id);
  const batchStatus = await poolBatchStatus(batch.id);

  if (batchStatus.status == "completed") {
    //get results
  } else {
    //handle failure
  }

  const fileData = await getResult(batchStatus.file!);
  return fileData;

  // const data = {
  //   generation: "Generation will be handled here",
  // };
  // return data;
}

async function poolBatchStatus(batchId: string): Promise<BatchStatus> {
  const batchStatus = await checkBatchStatus(batchId);
  console.log("pooling");

  if (batchStatus.status == "failed") {
    //cancel batch
    await cancelBatch(batchId);
    return {
      id: batchStatus.id,
      status: "failed",
      file: batchStatus.error_file_id,
    };
  } else if (batchStatus.status != "completed") {
    await delay(10);
    return await poolBatchStatus(batchId);
  } else if (batchStatus.status == "completed") {
    return {
      id: batchStatus.id,
      status: "completed",
      file: batchStatus.output_file_id,
    };
  } else {
    return {
      id: "sda",
      status: "failed",
    };
  }
}

type BatchStatus = {
  id: string;
  status: string;
  file?: string;
};
