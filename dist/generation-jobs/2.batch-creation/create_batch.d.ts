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
export declare function createBatch(filename: string): Promise<Batch>;
