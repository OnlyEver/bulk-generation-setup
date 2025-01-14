"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const dbName = config_1.config.dbName || "";
const db_uri = config_1.config.dbUri || "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(db_uri);
const _db = client.db(dbName);
const database = () => {
    return _db;
};
exports.database = database;
// export const sourceCollection = database.collection("_source");
// export const typologyCollection = database.collection("_typology");
// export const cardCollection = database.collection("_card");
