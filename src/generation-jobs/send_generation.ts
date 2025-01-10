import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { returnTypologyPrompt } from "./1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "./1.batch-prepare/parse_source_content";
import { config } from "../config";
import { delay } from "../utils/delay_helper";

import { sourceCollection, typologyCollection } from "../mongodb/connection";

import { prepareBatch } from "./2.batch-creation/create_batch";
import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { cancelBatch } from "./3.batch-status/cancel_batch";
import { returnCardGenPrompt } from "./1.batch-prepare/fetch-prompts/card_gen_prompt";
import { BSON, WithId } from "mongodb";
import { parseTypologyOnSuccess } from "../utils/parse_typology";


type BatchStatus = {
  id: string;
  status: string;
  file?: string;
};


export async function sendGeneration() {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });


  let docs = await sourceCollection.find({}).toArray();


  const customId = (doc: any, type: string) => {
    return JSON.stringify({
      id: doc._id.toString(),
      type: type,
      bloom_level: 1,
    });
  };

  const firstDoc = docs[0];
  const batchData = [
    {
      custom_id: customId(firstDoc, "typology"), // Unique identifier for each request.
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
              firstDoc.content,
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
    }
  ]

  // const batchData = docs.map((doc, index) => ({
  //   custom_id: customId(doc, "typology"), // Unique identifier for each request.
  //   method: "POST", // HTTP method.
  //   url: "/v1/chat/completions", // API endpoint.
  //   body: {
  //     model: "gpt-4o-mini",
  //     response_format: { type: "json_object" }, // Specify the model.
  //     messages: [
  //       { role: "system", content: returnTypologyPrompt() }, // System message.
  //       {
  //         role: "user",
  //         content: parseData(
  //           doc.content,
  //           [
  //             "See also",
  //             "References",
  //             "Further reading",
  //             "External links",
  //             "Notes and references",
  //             "Bibliography",
  //             "Notes",
  //             "Cited sources",
  //           ],
  //           ["table", "empty_line"]
  //         ),
  //       }, // User message (use doc content or default).
  //     ],
  //   },
  // }));


  // Write the batch data to a local file
  const filePath = "./batchinputonl";
  await fsPromise.writeFile(
    filePath,
    batchData.map((entry) => JSON.stringify(entry)).join("\n"),
    "utf-8"
  );
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputonl"),
    purpose: "batch",
  });

  // const batch = await prepareBatch(file.id);
  // const batchStatus = await poolBatchStatus(
  //   batch.id
  // );
  // if (batchStatus.status == "completed") {
  // const cardGenResponse = await sendCardGeneration(respone, docs);

  //   //get results

  // } else {
  //   //handle failure
  // }

  // const fileData = await getResult(batchStatus.file!);
  // return fileData;

  const respone = await getResult('file-AwS7kdAgAhczAKHSa5QobL');
  const cardGenResponse = await sendCardGeneration(respone, docs);


  const data = {
    generation: "Generation will be handled here",
  };
  return data;
}

async function insertSourceTypology(parsedTypology: Object, sourceId: string) {
  console.log('Inserting typology');
  console.log(parsedTypology);
  const doc = {
    _source_id: sourceId,
    typology: parsedTypology,
  }
  const result = await typologyCollection.insertOne(doc);
  console.log(result);

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



export async function sendCardGeneration(response: any[], docs: WithId<BSON.Document>[]) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });

  const cardGenBatchData =
    await Promise.all(response.map(async (batchResponse: any) => {
      const body = batchResponse['response']['body'];
      const content = body.choices[0]['message']['content'];
      const parsedContent = JSON.parse(content);
      // console.log(batchResponse);
      // console.log(parsedContent);
      const parsedTypology = parseTypologyOnSuccess(parsedContent);
      // console.log(parsedTypology);
      const customId = JSON.parse(batchResponse['custom_id']);
      const sourceId = customId['id'];
      await insertSourceTypology(parsedTypology, sourceId);
      const sourceContent = docs.find((doc) => doc._id == sourceId);
      return {
        custom_id: JSON.stringify({
          id: sourceId,
          type: 'card_gen',
          bloom_level: 1,
        }), // Unique identifier for each request.
        method: "POST", // HTTP method.
        url: "/v1/chat/completions", // API endpoint.
        body: {
          model: "gpt-4o-mini",
          response_format: { type: "json_object" }, // Specify the model.
          messages: [
            { role: "system", content: returnCardGenPrompt() }, // System message.
            {
              role: "user",
              content: JSON.stringify(parsedTypology) + parseData(
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
      }
    })
    );


  console.log(cardGenBatchData);

  // Write the batch data to a local file
  const cardGenFileData = "./batchinputForCardGen.jsonl";
  await fsPromise.writeFile(
    cardGenFileData,
    cardGenBatchData.map((entry) => JSON.stringify(entry)).join("\n"),
    "utf-8"
  );

  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputForCardGen.jsonl"),
    purpose: "batch",
  });

  await prepareBatch(file.id);

};



