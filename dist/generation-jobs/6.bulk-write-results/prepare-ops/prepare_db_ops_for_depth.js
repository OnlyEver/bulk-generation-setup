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
exports.writeDBOpsForDepth = writeDBOpsForDepth;
const mongodb_1 = require("mongodb");
const app_1 = require("../../../app");
function writeDBOpsForDepth(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = (0, app_1.getDbInstance)();
        const reqId = data.requestIdentifier;
        var metadata = data.metadata;
        const sourceId = reqId._source;
        const generatedData = data.generated_data;
        const dbOPS = [];
        const momoUserID = "11111111";
        const momoUserObjectID = new mongodb_1.ObjectId("665585e813684f253ea761b4");
        const sourceCollection = database.collection("_source");
        try {
            const source = yield sourceCollection.findOne({
                _id: new mongodb_1.ObjectId(sourceId),
            });
            if (source) {
                /// prepare cards objects
                const cardsObjects = generatedData.cards_data.map((elem) => {
                    return {
                        _id: new mongodb_1.ObjectId(),
                        _source: new mongodb_1.ObjectId(sourceId),
                        _user_id: momoUserID,
                        _owner: momoUserObjectID,
                        type: elem.type,
                        source_info: {
                            source_heading: elem.heading,
                            source_title: source === null || source === void 0 ? void 0 : source.title,
                        },
                        content: elem.content,
                        ctime: new Date(),
                        mtime: new Date(),
                        display_title: elem.displayTitle,
                        _access_to: [],
                        ai_generated: true,
                        explanation: elem.explanation,
                        generated_info: {
                            concepts: elem.concepts,
                            facts: elem.facts,
                            blooms_level: elem.bloom,
                        },
                    };
                });
                /// write metadata to generation info
                dbOPS.push({
                    collection: "_source",
                    query: {
                        updateOne: {
                            filter: {
                                _id: new mongodb_1.ObjectId(sourceId),
                            },
                            update: {
                                $addToSet: {
                                    generation_info: metadata,
                                    // "source_taxonomy.concepts": {
                                    //   $ele: generatedData.missing_concepts,
                                    // },
                                    // "source_taxonomy.facts": { $elem: generatedData.missing_facts },
                                },
                            },
                            upsert: true,
                        },
                    },
                });
                // insert to _cards
                cardsObjects.forEach((elem) => {
                    dbOPS.push({
                        collection: "_cards",
                        query: {
                            insertOne: elem,
                        },
                    });
                });
                const createdCardsIds = cardsObjects.map((elem) => ({
                    _id: elem._id,
                    position: getHeadingPosition(elem.source_info.source_heading, source.headings),
                }));
                // update to test set and _ai_cards
                dbOPS.push({
                    collection: "_source",
                    query: {
                        updateOne: {
                            filter: {
                                _id: new mongodb_1.ObjectId(sourceId),
                            },
                            update: {
                                $addToSet: {
                                    _ai_cards: {
                                        $each: createdCardsIds,
                                    },
                                    test_set: {
                                        $each: createdCardsIds,
                                    },
                                },
                            },
                        },
                    },
                });
            }
            return dbOPS;
        }
        catch (e) {
            return [];
        }
    });
}
function getHeadingPosition(headingText, headings) {
    if (headings) {
        return headings.indexOf(headingText);
    }
    else {
        return -1;
    }
}
//# sourceMappingURL=prepare_db_ops_for_depth.js.map