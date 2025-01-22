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
exports.populateQueue = populateQueue;
const mongodb_1 = require("mongodb");
const connection_1 = require("../../mongodb/connection");
const list_last_where_1 = require("../../utils/list_last_where");
/**
 * Function for populating the queue with generation requests based on the depth (card_gen)
 * and breadth (typology) of the source
 *
 * @async
 * @param sourceId `_id` of the source
 */
function populateQueue(sourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const sourceCollection = connection_1.database.collection('_source');
        const generationRequests = connection_1.database.collection('_generation_requests');
        const cardCollection = connection_1.database.collection('_card');
        let documents = []; // Array of documents to be inserted in the generation_requests collection
        try {
            const source = yield sourceCollection.findOne({
                _id: mongodb_1.ObjectId.createFromHexString(sourceId)
            }, {
                projection: { generation_info: 1, view_time: 1, source_taxonomy: 1, _ai_cards: 1 },
            });
            if (source) {
                const generationInfo = source.generation_info;
                const viewTime = source.view_time;
                const sourceTaxonomy = source.source_taxonomy;
                const aiCards = source._ai_cards.map((elem) => elem._id);
                if (Array.isArray(generationInfo) && generationInfo.length > 0) {
                    const lastBreadthRequest = (0, list_last_where_1.lastWhere)(generationInfo, (item) => item.req_type.type === 'breadth');
                    const calculatedViewTime = Math.floor(viewTime / 300);
                    // If the breadth request or source taxonomy exists
                    if (lastBreadthRequest || sourceTaxonomy) {
                        if (lastBreadthRequest.req_type.n_reqs <= calculatedViewTime) {
                            _insertBreadthRequest(((_b = (_a = lastBreadthRequest.req_type) === null || _a === void 0 ? void 0 : _a.n_reqs) !== null && _b !== void 0 ? _b : 0) + 1);
                        }
                        else {
                            /// For card generation or depth request 
                            const concepts = sourceTaxonomy.concepts;
                            const facts = sourceTaxonomy.facts;
                            const conceptTextArray = concepts.map((concept) => concept.concept_text);
                            const factTextArray = facts.map((fact) => fact.fact_text);
                            const bloomLevelCards = yield cardCollection.aggregate([
                                { $match: { "_id": { $in: aiCards } } },
                                { $group: { _id: '$generated_info.blooms_level', cards: { $push: { _id: '$_id', generated_info: '$generated_info' } } } },
                                { $sort: { _id: 1 } },
                                { $project: { _id: 0, level: '$_id', cards: 1 } },
                            ]).toArray();
                            let levelConcepts = []; /// An array of concept_text according to the bloom level
                            let levelFacts = []; /// An array of fact_text according to the bloom level
                            if (sourceTaxonomy.generate_cards.state) {
                                let maxRequestsForBloom = 5;
                                for (let bloom = 1; bloom <= 5; bloom++) {
                                    console.log("Bloom level: ", bloom);
                                    let missingConcepts = [];
                                    let missingFacts = [];
                                    const lastDepthRequest = (0, list_last_where_1.lastWhere)(generationInfo, (item) => { var _a, _b; return ((_a = item.req_type) === null || _a === void 0 ? void 0 : _a.type) === 'depth' && ((_b = item.req_type) === null || _b === void 0 ? void 0 : _b.bloom_level) === bloom; });
                                    if (lastDepthRequest) {
                                        if (((_d = (_c = lastDepthRequest.req_type) === null || _c === void 0 ? void 0 : _c.n_reqs) !== null && _d !== void 0 ? _d : 0) <= maxRequestsForBloom) {
                                            let levelCards = [];
                                            levelCards = ((_e = bloomLevelCards.find((item) => item.level === bloom)) === null || _e === void 0 ? void 0 : _e.cards) || [];
                                            if (levelCards.length > 0) {
                                                for (let card of levelCards) {
                                                    if (card.generated_info.concepts) {
                                                        for (let concept of card.generated_info.concepts) {
                                                            if (concept.concept_text) {
                                                                levelConcepts.push(concept.concept_text);
                                                            }
                                                        }
                                                    }
                                                    if (card.generated_info.facts) {
                                                        for (let fact of card.generated_info.facts) {
                                                            if (fact.fact_text) {
                                                                levelFacts.push(fact.fact_text);
                                                            }
                                                        }
                                                    }
                                                }
                                                if (levelConcepts.length > 0) {
                                                    const c = conceptTextArray.filter((concept) => !levelConcepts.includes(concept));
                                                    missingConcepts = [];
                                                    missingConcepts.push(...c);
                                                }
                                                if (levelFacts.length > 0) {
                                                    const f = factTextArray.filter((fact) => !levelFacts.includes(fact));
                                                    missingFacts = [];
                                                    missingFacts.push(...f);
                                                }
                                                if (missingConcepts.length > 0 || missingFacts.length > 0) {
                                                    const missingConceptsData = missingConcepts.map((concept) => { return concepts.find((e) => e.concept_text === concept); });
                                                    const missingFactsData = missingFacts.map((fact) => { return facts.find((e) => e.fact_text === fact); });
                                                    documents.push({
                                                        "_source": sourceId,
                                                        "ctime": new Date(),
                                                        "status": "created",
                                                        "request_type": {
                                                            "type": "depth",
                                                            "bloom_level": bloom,
                                                            "n_reqs": ((_f = lastDepthRequest === null || lastDepthRequest === void 0 ? void 0 : lastDepthRequest.n_reqs) !== null && _f !== void 0 ? _f : 0) + 1
                                                        },
                                                        "params": {
                                                            "missing_concepts": missingConceptsData,
                                                            "missing_facts": missingFactsData,
                                                        },
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        documents.push({
                                            "_source": sourceId,
                                            "ctime": new Date(),
                                            "status": "created",
                                            "request_type": {
                                                "type": "depth",
                                                "bloom_level": bloom,
                                                "n_reqs": 1
                                            },
                                            "params": {
                                                "missing_concepts": concepts,
                                                "missing_facts": facts,
                                            },
                                        });
                                    }
                                    maxRequestsForBloom--;
                                }
                            }
                        }
                    }
                    else {
                        _insertBreadthRequest(1);
                    }
                    const genReqs = yield generationRequests.insertMany(documents);
                    console.log("Inserted generation requests: ", genReqs.insertedCount);
                }
            }
            console.log("Documents: ", documents);
        }
        catch (error) {
            console.log("Error while populating queue: ", error);
            throw Error;
        }
        function _insertBreadthRequest(n_reqs) {
            documents.push({
                "_source": sourceId,
                "ctime": new Date(),
                "status": "created",
                "request_type": {
                    "type": "breadth",
                    "n_reqs": n_reqs
                }
            });
        }
    });
}
function handleDepthRequest() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
//# sourceMappingURL=populate_queue.js.map