import express from "express";
import { sendGeneration } from "./send_generation";
import { checkBatchStatus } from "./check_batch_status";
import { getResult } from "./get_result";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/send-generation", async (req, res) => {
  const data = await sendGeneration();
  res.send(data);
});

app.get("/check-status", async (req, res) => {
  // const data = await checkBatchStatus("1");
  const data = await checkBatchStatus("batch_677d070c405881909d5c6373fea1ab91");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});
app.get("/get-results", async (req, res) => {
  // const data = await checkBatchStatus("1");
  const data = await getResult("batch_677d070c405881909d5c6373fea1ab91");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});

// app.get("/connect", async (req, res) => {
//   const dbName = "bulk_generation";
//   const dbUri: string = config.dbUri || "mongodb://localhost:27017"; 
//   const client = new MongoClient(dbUri);

//   try {
//     // Attempt to connect to the MongoDB server
//     await client.connect();
//     console.log("Connected to the database!");

//     // Access the specific database
//     const database = client.db(dbName);

//     // Perform a test operation to confirm connection
//     const collections = await database.listCollections().toArray();

//     let docs = await database.collection("_source").find({}).toArray();

//     // Send a success response
//     res.status(200).json({
//       message: "Connected to the database successfully.",
//       databaseName: dbName,
//       collectionData: docs, // List collection names
//     });
//   } catch (error: unknown) {
//     console.error("Database connection failed:", error);

//     // Send an error response
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     res.status(500).json({
//       message: "Failed to connect to the database.",
//       error: errorMessage,
//     });
//   } finally {
//     // Ensure the client is closed
//     await client.close();
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
