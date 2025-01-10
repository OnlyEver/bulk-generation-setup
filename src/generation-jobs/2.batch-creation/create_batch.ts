import OpenAI from "openai";
import fs from "fs";
import { config } from "../../config";
import { Batch } from "openai/resources";


/**
 * Creates a batch using the provided input file for OpenAI's batch API.
 * Uploads the input file and creates a batch.
 *
 * @async
 * @returns {Promise<Batch>} - The batch object created by the OpenAI API.
 * @throws {Error} - Throws an error if file upload or batch creation fails.
 * 
 */
export async function createBatch(filename: string): Promise<Batch> {
  try {
    const openai = new OpenAI({
      apiKey: config.openAiKey,
    });

    const file = await openai.files.create({
      file: fs.createReadStream(filename),
      purpose: "batch",
    });

    const batch = await openai.batches.create({
      input_file_id: file.id,
      endpoint: "/v1/chat/completions",
      completion_window: "24h",
    });

    return batch;
  } catch (error) {
    console.error("Error during batch creation:", error);

    throw new Error(
      `Batch creation failed: ${error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}