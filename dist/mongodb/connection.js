"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceCollection = void 0;
const mongodb_1 = require("mongodb");
const dbName = "onlyever";
const db_uri = "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(db_uri);
const database = client.db(dbName);
exports.sourceCollection = database.collection("_source");
