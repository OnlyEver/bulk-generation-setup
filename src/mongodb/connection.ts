import { MongoClient } from "mongodb";
import { config } from "../config";

const dbName = config.dbName || "";
// const db_uri = "mongodb://localhost:27017";
const db_uri = config.dbUri || "mongodb://localhost:27017";
const client = new MongoClient(db_uri);
const conntection = client.db(dbName);

export const database = () => conntection;
