import { MongoClient, Db } from "mongodb";
import { config } from "../config";

const dbName = config.dbName || "";
// const db_uri = "mongodb://localhost:27017";
const db_uri = config.dbUri || "mongodb://localhost:27017";
const client = new MongoClient(db_uri);
// const connection = client.db(dbName);

let connectionInstance: Db | null = null;

export const database = async (): Promise<Db> => {
    console.log('Connection already exists: ', connectionInstance != null);
    if (!connectionInstance) {
        try {
            await client.connect(); // Establish connection
            console.log("Database connected successfully!");
            connectionInstance = client.db(dbName); // Save the instance
        } catch (error) {
            console.error("Failed to connect to the database:", error);
            throw error;
        }
    }
    return connectionInstance; // Return the existing or new instance
};

// export const database = () => connection;
