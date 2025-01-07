import OpenAI from "openai";
import fs from "fs";
import fsPromise from "fs/promises";

import { prepareBatch } from "./prepare_batch.js";
import { checkBatchStatus } from "./check_batch_status.js";
import { MongoClient } from "mongodb";
import { returnTypologyPrompt } from "../prompts/typology_prompt.js";
import { parseData } from "./parse_source_content.js";
import { config } from "../config.js";



export async function sendGeneration() {

  const dbName = 'onlyever';
  const db_uri = 'mongodb://localhost:27017';
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
          role: "user", content:
            parseData(doc.content, ['See also', 'References', 'Further reading', 'External links', 'Notes and references', 'Bibliography', 'Notes', 'Cited sources'],
              ['table', 'empty_line']),
        }, // User message (use doc content or default).
      ],
    },
  }));


  // Write the batch data to a local file
  const filePath = "./batchinput.jsonl";
  await fsPromise.writeFile(
    filePath,
    batchData.map((entry) => JSON.stringify(entry)).join("\n"),
    'utf-8'
  );


  const openai = new OpenAI({
    apiKey: config.openAiKey
  });
  const file = await openai.files.create({
    file: fs.createReadStream("./batchinput.jsonl"),
    purpose: "batch",
  });

  await prepareBatch(file.id);


  const data = {
    generation: "Generation will be handled here",
  };
  return data;
}


// const batchData = [

//   {
//     custom_id: "request-1",  // A unique identifier for this specific request in the batch
//     method: "POST",  // HTTP method
//     url: "/v1/chat/completions",  // The endpoint for the OpenAI API to request chat completions
//     body: {  // The payload (data) for the API request
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },  // A system message that sets the behavior of the assistant
//         { role: "user", content: "Hello world!" },  // The user's message, initiating the conversation
//       ],
//       max_tokens: 1000,  // The maximum number of tokens (words, phrases) the model is allowed to generate in response
//     },
//   },
//   {
//     custom_id: "request-2",
//     method: "POST",
//     url: "/v1/chat/completions",
//     body: {
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an unhelpful assistant." },
//         { role: "user", content: "Hello world!" },
//       ],
//       max_tokens: 1000,
//     },
//   },
// ];