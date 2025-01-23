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
                        "source_taxonomy.fields": generatedData.field,
                        "source_taxonomy.concepts": generatedData.concepts,
                        "source_taxonomy.facts": generatedData.facts,
                        "source_taxonomy.summary_cards": generatedData.summary_cards,
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