import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { returnTypologyPrompt } from "./1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "./1.batch-prepare/parse_source_content";
import { config } from "../config";
import { delay } from "../utils/delay_helper";

import { cardCollection, sourceCollection, typologyCollection } from "../mongodb/connection";

import { prepareBatch } from "./2.batch-creation/create_batch";
import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { cancelBatch } from "./3.batch-status/cancel_batch";
import { returnCardGenPrompt } from "./1.batch-prepare/fetch-prompts/card_gen_prompt";
import { BSON, ObjectId, WithId } from "mongodb";
import { parseTypologyOnSuccess } from "../utils/parse_typology";
import { parseCardGenResponse } from "./5.batch-parse/card_gen_result";
import { Card, insertCard, insertSourceTypology } from "../mongodb/insert";


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

  const batchData = docs.map((doc, index) => ({
    custom_id: customId(doc, "typology"), // Unique identifier for each request.
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
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputonl"),
    purpose: "batch",
  });

  const batch = await prepareBatch(file.id);
  const batchStatus = await poolBatchStatus(
    batch.id
  );
  if (batchStatus.status == "completed") {
    const response = await getResult(batchStatus.file!);
    // const respone = await getResult('file-AwS7kdAgAhczAKHSa5QobL');
    await sendCardGeneration(response, docs);
  } else {
    //handle failure
  }
  const data = {
    generation: "Generation will be handled here",
  };
  return data;
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
  const sourceId: any = '';


  //create batch data
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

  //write batch data in file 
  const cardGenFileData = "./batchinputForCardGen.jsonl";
  await fsPromise.writeFile(
    cardGenFileData,
    cardGenBatchData.map((entry) => JSON.stringify(entry)).join("\n"),
    "utf-8"
  );


  //create batch data
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputForCardGen.jsonl"),
    purpose: "batch",
  });

  var batch = await prepareBatch(file.id);
  const batchStatus = await poolBatchStatus(
    batch.id
  );
  if (batchStatus.status == "completed") {
    const generationContent = await getResult(batchStatus.file!);
    console.log(generationContent);
    generationContent.forEach(async (element) => {
      const body = element['response']['body'];
      const content = body.choices[0]['message']['content'];
      const parsedContent = JSON.parse(content);

      console.log('Logging content');
      console.log(parsedContent['test_cards']);

      const sourceContent = docs.find((doc) => doc._id == sourceId);
      const parsedC = parseCardGenResponse(parsedContent, false, sourceContent!.headings);
      if (parsedC.cards_data != null) {
        const cards: Card[] = Array.from(parsedC.cards_data!.entries()).map(([key, value]) => ({
          id: new ObjectId(key), // Convert the key to ObjectId
          heading: value.heading,
          content: value.content,
          concepts: value.concepts,
          facts: value.facts,
          bloomlevel: value.bloomLevel,
          displayTitle: value.displayTitle,
        }));
        await Promise.all(
          cards.map(async (card: Card) => {
            await insertCard(card, sourceId);
          }));
      }
    });

  } else {
    //handle failure
  }

};



