import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { returnTypologyPrompt } from "./1.batch-prepare/fetch-prompts/typology_prompt";
import { parseData } from "./1.batch-prepare/parse_source_content";
import { config } from "../config";
import { delay } from "../utils/delay_helper";

import { cardCollection, sourceCollection, typologyCollection } from "../mongodb/connection";

import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { cancelBatch } from "./3.batch-status/cancel_batch";
import { returnCardGenPrompt } from "./1.batch-prepare/fetch-prompts/card_gen_prompt";
import { BSON, ObjectId, WithId } from "mongodb";
import { parseTypologyOnSuccess } from "../utils/parse_typology";
import { parseCardGenResponse } from "./5.batch-parse/card_gen_result";
import { Card, insertCard, insertSourceTypology } from "../mongodb/insert";
import { prepareBatch } from "./1.batch-prepare/prepare_batch";
import { createBatch } from "./2.batch-creation/create_batch";
import { BatchStatusEnum } from "../enums/batch_status";
import { prepareBatchForCard } from "./1.batch-prepare/prepare_card_batch";


type BatchStatus = {
  id: string;
  status: string;
  file?: string;
};



export async function sendGeneration() {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });

  // console.log("Batch id: ", batch.id);
  let docs = await sourceCollection.find({}).toArray();


  await prepareBatch();
  const batch = await createBatch('./batchinput.jsonl');
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
  console.log(batchId);

  if (batchStatus.status == BatchStatusEnum.FAILED) {
    //cancel batch
    // await cancelBatch(batchId);
    return {
      id: batchStatus.id,
      status: BatchStatusEnum.FAILED,
      file: batchStatus.error_file_id,
    };
  } else if (batchStatus.status != BatchStatusEnum.COMPLETED) {
    await delay(10);
    return await poolBatchStatus(batchId);
  } else if (batchStatus.status == BatchStatusEnum.COMPLETED) {
    return {
      id: batchStatus.id,
      status: BatchStatusEnum.COMPLETED,
      file: batchStatus.output_file_id,
    };
  } else {
    return {
      id: "sda",
      status: BatchStatusEnum.FAILED,
    };
  }
}



export async function sendCardGeneration(response: any[], docs: WithId<BSON.Document>[]) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });

  const sourceId = await prepareBatchForCard(response, docs);
  var batch = await createBatch('./batchinputForCardGen.jsonl');

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

      const source = docs.find((doc) => doc._id == sourceId);
      var headings = [];
      if (source) {
        if (source.headings) {
          headings = source.headings;
        }
      }
      console.log(source);
      const parsedC = parseCardGenResponse(parsedContent, false, headings);
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



