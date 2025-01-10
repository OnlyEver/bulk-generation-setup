import { MongoClient } from "mongodb";

const dbName = "onlyever";
const db_uri = "mongodb://localhost:27017";
const client = new MongoClient(db_uri);
const database = client.db(dbName);
export const sourceCollection = database.collection("_source");
export const typologyCollection = database.collection("_typlogogy");
export const cardCollection = database.collection("_card");

