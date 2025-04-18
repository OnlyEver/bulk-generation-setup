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
 * @param sourceId - The `_id` of the source
 */
function populateQueue(sourceId_1, viewTimeThreshold_1) {
    return __awaiter(this, arguments, void 0, function* (sourceId, viewTimeThreshold, generateBreadthOnly = false) {
        var _a, _b, _c;
        const sourceCollection = connection_1.database.collection("_source");
        // const generationRequests = database.collection("_generation_requests");
        const cardCollection = connection_1.database.collection("_card");
        let documents = []; // Array of documents to be inserted in the generation_requests collection
        try {
            // if (generateBreadthOnly) {
            //   await _generateBreadthRequest();
            // } else {
            const source = yield sourceCollection.findOne({
                _id: new mongodb_1.ObjectId(sourceId),
            }, {
                projection: {
                    generation_info: 1,
                    view_time: 1,
                    source_taxonomy: 1,
                    _ai_cards: 1,
                },
            });
            if (source) {
                const generationInfo = source.generation_info;
                const viewTime = source.view_time;
                const sourceTaxonomy = source.source_taxonomy;
                const aiCards = ((_a = source._ai_cards) !== null && _a !== void 0 ? _a : []).map((elem) => elem._id);
                if (Array.isArray(generationInfo) && generationInfo.length > 0) {
                    const lastBreadthRequest = (0, list_last_where_1.findLastBreadthRequest)(generationInfo);
                    const calculatedViewTime = Math.floor(viewTime / viewTimeThreshold);
                    // If the breadth request or source taxonomy exists
                    if (lastBreadthRequest || sourceTaxonomy) {
                        if (lastBreadthRequest.req_type.n <= calculatedViewTime) {
                            _insertBreadthRequest(((_c = (_b = lastBreadthRequest.req_type) === null || _b === void 0 ? void 0 : _b.n) !== null && _c !== void 0 ? _c : 0) + 1, sourceId);
                        }
                        else {
                            if (!generateBreadthOnly) {
                                const depthDocuments = yield handleDepthRequest(sourceId, sourceTaxonomy, generationInfo, aiCards, cardCollection);
                                documents.push(...depthDocuments);
                            }
                        }
                    }
                    else {
                        /// Insert the initial breadth request with n = 1
                        _insertBreadthRequest(1, sourceId);
                    }
                }
                else {
                    _insertBreadthRequest(1, sourceId);
                }
            }
            const genReqs = yield handleUniqueInsertions(documents);
            console.log("Documents: ", documents);
            // }
        }
        catch (error) {
            console.log("Error while populating queue: ", error);
            throw Error;
        }
        function _generateBreadthRequest() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const sources = yield sourceCollection.find({}).limit(10000).toArray();
                    for (const source of sources) {
                        const generationInfo = source.generation_info;
                        const viewTime = source.view_time;
                        if (viewTime > 700) {
                            if (Array.isArray(generationInfo) && generationInfo.length > 0) {
                                const lastBreadthRequest = (0, list_last_where_1.findLastBreadthRequest)(generationInfo);
                                _insertBreadthRequest(((_b = (_a = lastBreadthRequest.req_type) === null || _a === void 0 ? void 0 : _a.n) !== null && _b !== void 0 ? _b : 0) + 1, source._id.toHexString());
                            }
                            _insertBreadthRequest(1, source._id.toHexString());
                        }
                    }
                    const genReqs = yield handleUniqueInsertions(documents);
                    return genReqs;
                }
                catch (e) {
                    console.error("Error while generating breadth request: ", e);
                }
            });
        }
        function _insertBreadthRequest(n, sourceId = "") {
            documents.push({
                _source: sourceId,
                ctime: new Date(),
                status: "created",
                request_type: {
                    type: "breadth",
                    n: n,
                },
            });
        }
    });
}
/**
 * Handles the depth request generation by determining mis sing concepts and facts for each bloom level.
 *
 * @async
 * @param sourceId - The `_id` of the source.
 * @param sourceTaxonomy - The taxonomy data of the source.
 * @param generationInfo - Information about previous generation requests.
 * @param aiCards - Array of AI card ObjectIds for the source.
 * @param cardCollection - The collection containing card data.
 * @returns {Promise<any[]>} - A promise resolving to an array of generation request documents.
 */
function handleDepthRequest(sourceId, sourceTaxonomy, generationInfo, aiCards, cardCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            let documents = [];
            const concepts = (_a = sourceTaxonomy.concepts) !== null && _a !== void 0 ? _a : [];
            const facts = (_b = sourceTaxonomy.facts) !== null && _b !== void 0 ? _b : [];
            const conceptTextArray = concepts.map((concept) => concept.concept_text);
            const oldfactTextArray = facts.map((fact) => fact.fact_text);
            const factTextArray = [...oldfactTextArray, ...concepts.map((concept) => {
                    if (concept.type === "fact") {
                        return concept.concept_text;
                    }
                })
            ];
            const bloomLevelCards = yield cardCollection
                .aggregate([
                { $match: { _id: { $in: aiCards } } },
                {
                    $group: {
                        _id: "$generated_info.blooms_level",
                        cards: { $push: "$$ROOT" },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, level: "$_id", cards: 1 } },
            ])
                .toArray();
            if (sourceTaxonomy.generate_cards.state) {
                let maxRequestsForBloom = 4;
                let levelConcepts = []; /// An array of concept_text according to the bloom level
                let levelFacts = []; /// An array of fact_text according to the bloom level
                for (let bloom = 1; bloom <= 5; bloom++) {
                    console.log("Bloom level: ", bloom);
                    let missingConcepts = [];
                    let missingFacts = [];
                    const lastDepthRequest = (0, list_last_where_1.findLastDepthRequest)(generationInfo, "depth", bloom);
                    const cards = [];
                    if (lastDepthRequest) {
                        if (((_d = (_c = lastDepthRequest.req_type) === null || _c === void 0 ? void 0 : _c.n) !== null && _d !== void 0 ? _d : 1) <= maxRequestsForBloom) {
                            let levelCards = [];
                            levelCards =
                                ((_e = bloomLevelCards.find((item) => item.level == bloom)) === null || _e === void 0 ? void 0 : _e.cards) || [];
                            if (levelCards.length > 0) {
                                for (let card of levelCards) {
                                    if (card.generated_info.concepts) {
                                        for (let concept of card.generated_info.concepts) {
                                            levelConcepts.push(concept);
                                        }
                                    }
                                    if (card.generated_info.facts) {
                                        for (let fact of card.generated_info.facts) {
                                            levelFacts.push(fact);
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
                                    const missingConceptsData = missingConcepts.map((concept) => {
                                        return concepts.find((e) => e.concept_text === concept);
                                    });
                                    const missingFactsData = missingFacts.map((fact) => {
                                        return facts.find((e) => e.fact_text === fact);
                                    });
                                    documents.push({
                                        _source: sourceId,
                                        ctime: new Date(),
                                        status: "created",
                                        request_type: {
                                            type: "depth",
                                            bloom_level: bloom,
                                            n: ((_g = (_f = lastDepthRequest === null || lastDepthRequest === void 0 ? void 0 : lastDepthRequest.req_type) === null || _f === void 0 ? void 0 : _f.n) !== null && _g !== void 0 ? _g : 0) + 1,
                                        },
                                        params: {
                                            missing_concepts: missingConceptsData,
                                            missing_facts: missingFactsData,
                                        },
                                    });
                                }
                            }
                            else {
                                documents.push({
                                    _source: sourceId,
                                    ctime: new Date(),
                                    status: "created",
                                    request_type: {
                                        type: "depth",
                                        bloom_level: bloom,
                                        n: ((_j = (_h = lastDepthRequest.req_type) === null || _h === void 0 ? void 0 : _h.n) !== null && _j !== void 0 ? _j : 0) + 1,
                                    },
                                    params: {
                                        missing_concepts: concepts,
                                        missing_facts: facts,
                                    },
                                });
                            }
                        }
                    }
                    else {
                        documents.push({
                            _source: sourceId,
                            ctime: new Date(),
                            status: "created",
                            request_type: {
                                type: "depth",
                                bloom_level: bloom,
                                n: 1,
                            },
                            params: {
                                missing_concepts: concepts,
                                missing_facts: facts,
                            },
                        });
                    }
                    maxRequestsForBloom--;
                }
            }
            return documents;
        }
        catch (error) {
            console.log("Error while handling depth request: ", error);
            throw error;
        }
    });
}
function handleUniqueInsertions(documents) {
    return __awaiter(this, void 0, void 0, function* () {
        const generationRequests = connection_1.database.collection("_generation_requests");
        for (const doc of documents) {
            const existingDoc = yield generationRequests.findOne({
                _source: doc._source,
                request_type: doc.request_type,
            });
            if (!existingDoc) {
                try {
                    yield generationRequests.insertOne(doc);
                }
                catch (e) {
                    console.log(`Error while inserting document: ${JSON.stringify(doc)}`);
                    console.log(e);
                }
                console.log(`Inserted document: ${JSON.stringify(doc)}`);
            }
            else {
                console.log(`Duplicate document found for _source: ${doc._source}, skipping insertion.`);
            }
        }
    });
}
//# sourceMappingURL=populate_queue.js.map