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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrespondingConcepts = exports.addEmbeddingsToCollection = exports.getCollection = exports.createCollection = void 0;
const qdrant_services_1 = __importDefault(require("../services/qdrant_services"));
const createCollection = (collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    yield qdrant_services_1.default.createCollection(collectionName, {
        vectors: {
            size: 1536,
            distance: "Cosine",
        },
    });
});
exports.createCollection = createCollection;
const getCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield qdrant_services_1.default.getCollections();
    return collection;
});
exports.getCollection = getCollection;
const getCorrespondingConcepts = (collectionName, embeddings, threshold) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = embeddings.map((e) => {
            return {
                query: e.embedding,
                limit: 1,
                score_threshold: threshold,
                with_payload: true,
            };
        });
        const results = yield qdrant_services_1.default.queryBatch(collectionName, {
            searches: searchQuery,
        });
        return results;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getCorrespondingConcepts = getCorrespondingConcepts;
const addEmbeddingsToCollection = (collectionName, embeddings) => __awaiter(void 0, void 0, void 0, function* () {
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < embeddings.length; i += CHUNK_SIZE) {
        const batch = embeddings.slice(i, i + CHUNK_SIZE);
        yield qdrant_services_1.default.upsert(collectionName, {
            wait: true,
            points: batch,
        });
    }
});
exports.addEmbeddingsToCollection = addEmbeddingsToCollection;
//# sourceMappingURL=qdrant_db_helper.js.map