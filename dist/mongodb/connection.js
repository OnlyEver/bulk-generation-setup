"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUp = exports.database = void 0;
const mongodb_1 = require("mongodb");
const setUp = (connectionUri, dbName) => {
    const client = new mongodb_1.MongoClient(connectionUri);
    exports.database = client.db(dbName);
};
exports.setUp = setUp;
// export const sourceCollection = database.collection("_source");
// export const typologyCollection = database.collection("_typology");
// export const cardCollection = database.collection("_card");
