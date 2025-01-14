import { Db, MongoClient } from "mongodb";
import { config } from "../config";

export var database: Db;
export const setUp = (connectionUri: string, dbName: string) => {
  const client = new MongoClient(connectionUri);
  database = client.db(dbName);
};
// export const sourceCollection = database.collection("_source");
// export const typologyCollection = database.collection("_typology");
// export const cardCollection = database.collection("_card");
