"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateEmbeddingRequests = populateEmbeddingRequests;
const mongodb_1 = require("mongodb");
const connection_1 = require("../../mongodb/connection");
function populateEmbeddingRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        const generationRequests = connection_1.database.collection("_generation_requests");
        const sourceCollection = connection_1.database.collection("_source");
        const embeddingRequests = [];
        const sourcesThatNeedEmbedding = yield sourceCollection
            .find({
            embedding_requested: { $exists: false },
            view_time: { $gte: 700 },
        })
            .limit(900)
            .toArray();
        const objectIds = sourcesThatNeedEmbedding.map((source) => source._id);
        for (const source of sourcesThatNeedEmbedding) {
            const req = {
                _id: new mongodb_1.ObjectId(),
                _source: source._id.toString(),
                ctime: new Date(),
                status: "created",
                request_type: {
                    type: "embedding",
                },
            };
            embeddingRequests.push(req);
        }
        yield generationRequests.insertMany(embeddingRequests);
        yield sourceCollection.updateMany({ _id: { $in: objectIds } }, { $set: { embedding_requested: true } });
    });
}
//# sourceMappingURL=populate_embedding_requests.js.map