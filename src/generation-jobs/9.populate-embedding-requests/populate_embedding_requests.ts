import { Collection, ObjectId } from "mongodb";
import { database } from "../../mongodb/connection";

export async function populateEmbeddingRequests() {
  const generationRequests = database.collection("_generation_requests");
  const sourceCollection = database.collection("_source");
  const embeddingRequests = [];

  const sourcesThatNeedEmbedding = await sourceCollection
    .find({
      embedding_requested: { $exists: false },
      view_time: { $gte: 700 },
    })
    .limit(900)
    .toArray();

  const objectIds = sourcesThatNeedEmbedding.map((source) => source._id);

  for (const source of sourcesThatNeedEmbedding) {
    const req = {
      _id: new ObjectId(),
      _source: source._id.toString(),
      ctime: new Date(),
      status: "created",
      request_type: {
        type: "embedding",
      },
    };
    embeddingRequests.push(req);
  }

  await generationRequests.insertMany(embeddingRequests);
  await sourceCollection.updateMany(
    { _id: { $in: objectIds } },
    { $set: { embedding_requested: true } }
  );
}
