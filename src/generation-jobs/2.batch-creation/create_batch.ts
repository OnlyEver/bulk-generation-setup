import fs from "fs";
import { config } from "../../config";
import { Batch } from "openai/resources";
import { openAI } from "../../openai/openai_helper";


/**
 * Creates a batch using the provided input file for OpenAI's batch API.
 * Uploads the input file and creates a batch.
 *
 * @async
 * @returns {Promise<Batch>} - The batch object created by the OpenAI API.
 * @throws {Error} - Throws an error if file upload or batch creation fails.
 * 
 */
export async function createBatch(fileList: string[]): Promise<Batch[]> {
  try {
    var batchList: Batch[] = [];

    fileList.forEach(async (filename) => {
      const file = await openAI().files.create({
        file: fs.createReadStream(filename),
        purpose: "batch",
      });

      const batch = await openAI().batches.create({
        input_file_id: file.id,
        endpoint: "/v1/chat/completions",
        completion_window: "24h",
      });
      batchList.push(batch);
    });


    return batchList;
  } catch (error) {
    console.error("Error during batch creation:", error);

    throw new Error(
      `Batch creation failed: ${error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}