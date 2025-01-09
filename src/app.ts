import express, { Request, Response, NextFunction } from "express";
import { sendGeneration } from "./generation-jobs/send_generation";
import { checkBatchStatus } from "./generation-jobs/3.batch-status/check_batch_status";
import { getResult } from "./generation-jobs/4.batch-result/get_result";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.send("Hello, world!");
});

/// middleware that will be executed on every request, user for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message || err);
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred.";
  res.status(status).json({ error: true, message });
});

app.get("/send-generation", async (req: any, res: any, next: NextFunction) => {
  try {
    const data = await sendGeneration();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get("/check-status", async (req: Request, res: any, next: NextFunction) => {
  try {
  // const data = await checkBatchStatus("1");
  // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
  const data = await checkBatchStatus("batch_677d070dfd008190ad9b8a48cf6717e4");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
  } catch (error) {
    next(error);
  }
});
app.get("/get-results", async (req: any, res: any, next: NextFunction) => {
  try {
  // const data = await checkBatchStatus("1");
  const data = await getResult("file-VYk48giUdr2NLJ5cDGcCW2");
  // batch_677d070dfd008190ad9b8a48cf6717e4
  res.send(data);
  } catch (error) {
    next(error);
  }
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

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: true, message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
