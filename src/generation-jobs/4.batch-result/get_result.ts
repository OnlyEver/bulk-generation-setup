import OpenAI from "openai";
import { config } from "../../config";
import fs from "fs/promises";
export async function getResult(fileid: string) {
  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const fileResponse = await openai.files.content(fileid);
  const fileContents = await fileResponse.text();

  console.log(fileContents);
  const parsedString = parseJsonlFile(fileContents.toString());
  return parsedString;
  // return JSON.parse(pa);
}


const parseJsonlFile = (content: string) => {
  try {
    // Read the JSONL file content
    // const fileContent = await fs.readFile(content, "utf8");

    // Split the content into lines and parse each line as JSON
    const data = content
      .split("\n") // Split by newline character
      .filter((line) => line.trim() !== "") // Remove empty lines
      .map((line) => JSON.parse(line)); // Parse each line as JSON

    console.log("Parsed JSONL Data:", data);
    return data;
  } catch (error) {
    console.error("Error parsing JSONL file:", error);
    throw error;
  }
};

// File path of the JSONL file to parse
// const filePath = "./batchoutput.jsonl";

// // Call the function to parse the JSONL file
// const jsonData = await parseJsonlFile(filePath);

// // Example usage
// jsonData.forEach((entry) => console.log(entry));
