"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const send_generation_1 = require("./generation-jobs/send_generation");
const check_batch_status_1 = require("./generation-jobs/3.batch-status/check_batch_status");
const get_result_1 = require("./generation-jobs/4.batch-result/get_result");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
/// middleware that will be executed on every request, user for error handling
app.use((err, req, res, next) => {
    console.error("Error:", err.message || err);
    const status = err.status || 500;
    const message = err.message || "An unexpected error occurred.";
    res.status(status).json({ error: true, message });
});
app.get("/send-generation", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, send_generation_1.sendGeneration)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}));
app.get("/check-status", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const data = await checkBatchStatus("1");
        // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
        const data = yield (0, check_batch_status_1.checkBatchStatus)("batch_6780fabe3e388190a153dce03eeecc4c");
        // batch_677d070dfd008190ad9b8a48cf6717e4
        res.send(data);
    }
    catch (error) {
        next(error);
    }
}));
app.get("/get-results", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const data = await checkBatchStatus("1");
        const data = yield (0, get_result_1.getResult)("file-VYk48giUdr2NLJ5cDGcCW2");
        // batch_677d070dfd008190ad9b8a48cf6717e4
        res.send(data);
    }
    catch (error) {
        next(error);
    }
}));
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
app.use((req, res) => {
    res.status(404).json({ error: true, message: "Route not found." });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
