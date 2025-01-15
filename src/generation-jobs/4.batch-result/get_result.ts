import { openAI } from "../../openai/openai_helper";
export async function getResult(fileid: string) {

  const fileResponse = await openAI().files.content(fileid);
  const fileContents = await fileResponse.text();

  const parsedString = _parseJsonlFile(fileContents.toString());
  return parsedString;
  // return JSON.parse(pa);
}

const _parseJsonlFile = (content: string) => {
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
