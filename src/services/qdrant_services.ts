import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config";

// or connect to Qdrant Cloud
const qdrantClient = new QdrantClient({
    url: config.qdrantUrl,
    apiKey: config.qdrantApiKey,
});

export default qdrantClient;
