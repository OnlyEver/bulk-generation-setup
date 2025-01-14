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
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const dbName = config_1.config.dbName || "";
// const db_uri = "mongodb://localhost:27017";
const db_uri = config_1.config.dbUri || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(db_uri);
// const connection = client.db(dbName);
let connectionInstance = null;
const database = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connection already exists: ', connectionInstance != null);
    if (!connectionInstance) {
        try {
            yield client.connect(); // Establish connection
            console.log("Database connected successfully!");
            connectionInstance = client.db(dbName); // Save the instance
        }
        catch (error) {
            console.error("Failed to connect to the database:", error);
            throw error;
        }
    }
    return connectionInstance; // Return the existing or new instance
});
exports.database = database;
// export const database = () => connection;
