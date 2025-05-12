import qdrantClient from "../services/qdrant_services";

const createCollection = async (collectionName: string) => {
  await qdrantClient.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
  });
};

const getCollection = async () => {
  const collection = await qdrantClient.getCollections();
  return collection;
};

const getCorrespondingConcepts = async (
  collectionName: string,
  embeddings: {
    text: string;
    id: string;
    type: string;
    reference: string;
    embedding: number[];
  }[],
  threshold: number
) => {
  try {
    const searchQuery = embeddings.map((e) => {
      return {
        query: e.embedding,
        limit: 1,
        score_threshold: threshold,
        with_payload: true,
      };
    });
    const results = await qdrantClient.queryBatch(collectionName, {
      searches: searchQuery,
    });
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addEmbeddingsToCollection = async (
  collectionName: string,
  embeddings: {
    id: string;
    vector: number[];
    payload: {
      _sources: string[];
      text: string;
    };
  }[]
) => {
  const CHUNK_SIZE = 1000;
  for (let i = 0; i < embeddings.length; i += CHUNK_SIZE) {
    const batch = embeddings.slice(i, i + CHUNK_SIZE);
    await qdrantClient.upsert(
      collectionName,

      {
        wait: true,
        points: batch,
      }
    );
  }
};

export {
  createCollection,
  getCollection,
  addEmbeddingsToCollection,
  getCorrespondingConcepts,
};
