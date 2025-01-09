import express from "express";
import { sendGeneration } from "./generation-jobs/send_generation";
import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.send("Hello, world!");
});

app.get("/send-generation", async (req: any, res: any) => {
  const data = await sendGeneration();
  res.send(data);
});

app.get("/check-status", async (req: Request, res: any) => {
  // const data = await checkBatchStatus("1");
  // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
  const data = await checkBatchStatus("batch_677d070dfd008190ad9b8a48cf6717e4");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});
app.get("/get-results", async (req: any, res: any) => {
  // const data = await checkBatchStatus("1");
  const data = await getResult("file-VYk48giUdr2NLJ5cDGcCW2");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
});

// app.get("/connect", async (req, res) => {
//   const dbName = config.dbName;
//   const dbUri: string = config.dbUri || "mongodb://localhost:27017"; 
//   const client = new MongoClient(dbUri);

//   try {
//     await client.connect();
//     console.log("Connected to the database!");
//     const database = client.db(dbName);

//     // Perform a test operation to confirm connection
//     const collections = await database.listCollections().toArray();

//     let docs = await database.collection("_source").find({}).toArray();

//     res.status(200).json({
//       message: "Connected to the database successfully.",
//       databaseName: dbName,
//       collectionData: docs, // List collection names
//     });
//   } catch (error: unknown) {
//     console.error("Database connection failed:", error);

//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     res.status(500).json({
//       message: "Failed to connect to the database.",
//       error: errorMessage,
//     });
//   } finally {
//     await client.close();
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
