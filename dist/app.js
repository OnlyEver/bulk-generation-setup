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
const send_generation_1 = require("./send_generation");
const check_batch_status_1 = require("./check_batch_status");
const get_result_1 = require("./get_result");
const config_1 = require("./config");
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.get("/send-generation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, send_generation_1.sendGeneration)();
    res.send(data);
}));
app.get("/check-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    // const data = await checkBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
    const data = yield (0, check_batch_status_1.checkBatchStatus)("batch_677d070dfd008190ad9b8a48cf6717e4");
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
}));
app.get("/get-results", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await checkBatchStatus("1");
    const data = yield (0, get_result_1.getResult)("file-76uGtVWsMYyB9MfncqRV5L");
    // batch_677d070dfd008190ad9b8a48cf6717e4
    res.send(data);
}));
app.get("/connect", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dbName = "bulk_generation";
    const dbUri = config_1.config.dbUri || "mongodb://localhost:27017";
    const client = new mongodb_1.MongoClient(dbUri);
    try {
        // Attempt to connect to the MongoDB server
        yield client.connect();
        console.log("Connected to the database!");
        // Access the specific database
        const database = client.db(dbName);
        // Perform a test operation to confirm connection
        const collections = yield database.listCollections().toArray();
        let docs = yield database.collection("_source").find({}).toArray();
        // Send a success response
        res.status(200).json({
            message: "Connected to the database successfully.",
            databaseName: dbName,
            collectionData: docs, // List collection names
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        // Send an error response
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            message: "Failed to connect to the database.",
            error: errorMessage,
        });
    }
    finally {
        // Ensure the client is closed
        yield client.close();
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
