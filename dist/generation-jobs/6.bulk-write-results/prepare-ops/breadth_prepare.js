"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDBOpsForBreadth = writeDBOpsForBreadth;
const mongodb_1 = require("mongodb");
function writeDBOpsForBreadth(data) {
    var _a, _b;
    const reqId = data.requestIdentifier;
    var metadata = data.metadata;
    const sourceId = reqId._source;
    const generatedData = data.generated_data;
    const dbOPS = [];
    const facts = (_b = (_a = generatedData.facts) === null || _a === void 0 ? void 0 : _a.map((e) => {
        return {
            concept_text: e.fact_text,
            reference: e.reference,
            type: "fact",
        };
    })) !== null && _b !== void 0 ? _b : [];
    const generatedConcepts = generatedData.concepts.map((e) => {
        return {
            concept_text: e.concept_text,
            reference: e.reference,
            type: "concept",
        };
    });
    const concepts = [...generatedConcepts, ...facts];
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
                        "source_taxonomy.fields": { $each: generatedData.field },
                        "source_taxonomy.concepts": { $each: concepts },
                        summary_cards: {
                            $each: generatedData.summary_cards,
                        },
                    },
                    $set: {
                        "source_taxonomy.generate_cards": generatedData.generate_cards,
                    },
                },
                upsert: true,
            },
        },
    });
    return dbOPS;
}
//# sourceMappingURL=breadth_prepare.js.map