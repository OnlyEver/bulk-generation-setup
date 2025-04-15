"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDBOpsForBreadth = writeDBOpsForBreadth;
const mongodb_1 = require("mongodb");
function writeDBOpsForBreadth(data) {
    const reqId = data.requestIdentifier;
    var metadata = data.metadata;
    const sourceId = reqId._source;
    const generatedData = data.generated_data;
    const dbOPS = [];
    const facts = generatedData.facts.map((e) => {
        return {
            concept_text: e.fact_text,
            reference: e.reference,
        };
    });
    const concepts = [...generatedData.concepts, ...facts];
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
                        "source_taxonomy.facts": { $each: generatedData.facts },
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