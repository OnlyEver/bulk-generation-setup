import "dotenv/config";

export const config = {
  openAiKey: process.env.OPENAIKEY,
  dbUri: process.env.DB_URI ?? "",
  dbName: process.env.DB_NAME,
  qdrantApiKey: process.env.QDRANT_API_KEY,
  qdrantUrl: process.env.QDRANT_URL,
};
