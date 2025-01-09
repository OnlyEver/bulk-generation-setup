
import { delay } from "../helper_function/delay_helper";
import { createBatch } from "./2.batch-creation/create_batch";  
import { prepareBatch } from "./1.batch-prepare/prepare_batch";
import { getResult } from "./4.batch-result/get_result";
import { checkBatchStatus } from "./3.batch-status/check_batch_status";
import { cancelBatch } from "./3.batch-status/cancel_batch";
import { BatchStatusEnum } from "../enums/batch_status";

export async function sendGeneration() {
  await prepareBatch();

  const batch = await createBatch();

  console.log("Batch id: ", batch.id);

  const batchStatus = await poolBatchStatus(
    "batch_677e2d19065081909e98849d40dd11ed"
  );

  if (batchStatus.status == BatchStatusEnum.COMPLETED) {
    //get results
  } else {
    //handle failure
  }

  const fileData = await getResult(batchStatus.file!);
  return fileData;
}

async function poolBatchStatus(batchId: string): Promise<BatchStatus> {
  const batchStatus = await checkBatchStatus(batchId);
  console.log("pooling");

  if (batchStatus.status == BatchStatusEnum.FAILED) {
    //cancel batch
    await cancelBatch(batchId);
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

type BatchStatus = {
  id: string;
  status: BatchStatusEnum;
  file?: string;
};
