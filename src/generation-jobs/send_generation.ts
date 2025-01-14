import OpenAI from "openai";
import fsPromise from "fs/promises";

import { config } from "../config";
import { delay } from "../utils/delay_helper";

import { database } from "../mongodb/connection";

import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { BSON, ObjectId, WithId } from "mongodb";
import { parseCardGenResponse } from "./5.batch-parse/card_gen_result";
import { Card, insertCard, insertSourceTypology } from "../mongodb/insert";
import { prepareBatch } from "./1.batch-prepare/prepare_batch";
import { createBatch } from "./2.batch-creation/create_batch";
import { BatchStatusEnum } from "../enums/batch_status";
import { prepareBatchForCard } from "./1.batch-prepare/prepare_card_batch";

type BatchStatus = {
  id: string;
  status: BatchStatusEnum;
  file?: string;
};

export async function sendGeneration() {

  const sourceCollection = database().collection("_source");

  // console.log("Batch id: ", batch.id);
  let docs = await sourceCollection.find({}).toArray();

  await prepareBatch();
  const batch = await createBatch("./batchinput.jsonl");
  const batchStatus = await poolBatchStatus(batch.id);
  if (batchStatus.status == BatchStatusEnum.COMPLETED) {
    const response = await getResult(batchStatus.file!);
    // const respone = await getResult('file-AwS7kdAgAhczAKHSa5QobL');
    await sendCardGeneration(response, docs);
  } else {
    //handle failure
    if (batchStatus.file) {
      await handleBatchFailure(batchStatus.file!);
    }
  }
  const data = {
    generation: "Generation will be handled here",
  };
  return data;
}

async function poolBatchStatus(batchId: string): Promise<BatchStatus> {
  const batchStatus = await checkBatchStatus(batchId);
  console.log("pooling");
  console.log("Batch Id: ", batchId);

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
      file: batchStatus.error_file_id,
    };
  }
}

export async function sendCardGeneration(
  response: any[],
  docs: WithId<BSON.Document>[]
) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });

  const sourceId = await prepareBatchForCard(response, docs);
  var batch = await createBatch("./batchinputForCardGen.jsonl");

  const batchStatus = await poolBatchStatus(batch.id);
  if (batchStatus.status == "completed") {
    const generationContent = await getResult(batchStatus.file!);
    console.log(generationContent);
    generationContent.forEach(async (element) => {
      const body = element["response"]["body"];
      const content = body.choices[0]["message"]["content"];
      const parsedContent = JSON.parse(content);

      console.log("Logging content");
      console.log(parsedContent["test_cards"]);

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
        const cards: Card[] = Array.from(parsedC.cards_data!.entries()).map(
          ([key, value]) => ({
            id: new ObjectId(key), // Convert the key to ObjectId
            heading: value.heading,
            content: value.content,
            concepts: value.concepts,
            facts: value.facts,
            bloomlevel: value.bloomLevel,
            displayTitle: value.displayTitle,
          })
        );
        await Promise.all(
          cards.map(async (card: Card) => {
            await insertCard(card, sourceId);
          })
        );
      }
    });
  } else {
    //handle failure
    if (batchStatus.file) {
      await handleBatchFailure(batchStatus.file!);
    }
  }
}

/**
 * Handles a failed batch by retrieving and saving the error file content.
 * Overrides the file if it already exists.
 *
 * @param errorFileId - The ID of the error file to retrieve.
 */
async function handleBatchFailure(errorFileId: string) {
  try {
    console.error("Batch failed. Retrieving error file...");

    // Retrieve the error file content
    const errorContent = await getResult(errorFileId);

    // Save the error response to a local file
    const errorFilePath = "./error_file_response.json";
    await fsPromise.writeFile(
      errorFilePath,
      JSON.stringify(errorContent, null, 2),
      "utf-8"
    );

    console.log(`Error file saved at: ${errorFilePath}`);
  } catch (error) {
    console.error("Failed to retrieve or save the error file:", error);
    throw error;
  }
}
