import { MongoClient } from "mongodb";
import { config } from "../config";

const dbName = config.dbName || "";
const db_uri = config.dbUri || "mongodb://localhost:27017";
const client = new MongoClient(db_uri);
const _db = client.db(dbName);

export const database = () => {
  return _db;
};
// export const sourceCollection = database.collection("_source");
// export const typologyCollection = database.collection("_typology");
// export const cardCollection = database.collection("_card");
