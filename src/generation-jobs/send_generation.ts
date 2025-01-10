
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
      file: batchStatus.error_file_id,
    };
  }
}

type BatchStatus = {
  id: string;
  status: BatchStatusEnum;
  file?: string;
};



