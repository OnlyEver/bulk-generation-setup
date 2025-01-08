import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { prepareBatch } from "./prepare_batch";
import { checkBatchStatus } from "./check_batch_status";
import { MongoClient } from "mongodb";
import { returnTypologyPrompt } from "./prompts/typology_prompt";
import { parseData } from "./parse_source_content";
import { config } from "./config";

export async function sendGeneration() {
  const dbName = "onlyever";
  const db_uri = "mongodb://localhost:27017";
  const client = new MongoClient(db_uri);
  const database = client.db(dbName);
  const collection = database.collection("_source");

  let docs = await collection.find({}).toArray();
  let fields = [
    "Sciences",
    "Technology & Engineering",
    "Humanities & Cultural Studies",
    "Social Sciences & Global Studies",
    "Business & Management",
    "Health & Medicine",
    "Environmental Studies & Earth Sciences",
    "Education, Learning & Personal Development",
    "Creative & Performing Arts",
    "Law, Governance & Ethics",
    "Recreation, Lifestyle & Practical Skills",
    "Technology & Media Literacy",
    "Philosophy & Critical Thinking",
    "Space & Astronomical Sciences",
    "Agriculture & Food Sciences",
    "Trades & Craftsmanship",
    "Reference & Indexing",
    "Other",
  ];

  const batchData = docs.map((doc, index) => ({
    custom_id: `request-${index + 1}`, // Unique identifier for each request.
    method: "POST", // HTTP method.
    url: "/v1/chat/completions", // API endpoint.
    body: {
      model: "gpt-4o-mini", // Specify the model.
      messages: [
        { role: "system", content: returnTypologyPrompt() }, // System message.
        {
          role: "user",
          content: parseData(
            doc.content,
            [
              "See also",
              "References",
              "Further reading",
              "External links",
              "Notes and references",
              "Bibliography",
              "Notes",
              "Cited sources",
            ],
            ["table", "empty_line"]
          ),
        }, // User message (use doc content or default).
      ],
    },
  }));

  // Write the batch data to a local file
  const filePath = "./batchinputonl";
  await fsPromise.writeFile(
    filePath,
    batchData.map((entry) => JSON.stringify(entry)).join("\n"),
    "utf-8"
  );

  const openai = new OpenAI({
    apiKey: config.openAiKey,
  });
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinputonl"),
    purpose: "batch",
  });

  await prepareBatch(file.id);

  const data = {
    generation: "Generation will be handled here",
  };
  return data;
}
