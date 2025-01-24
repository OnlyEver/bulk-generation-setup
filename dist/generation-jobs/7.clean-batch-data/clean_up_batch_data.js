"use strict";
/// this method will clean up the _generation_requests collection and _batch_data collection
/// On Completion of the batch processing
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
exports.cleanUpBatchData = cleanUpBatchData;
const app_1 = require("../../app");
function cleanUpBatchData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ batch_id, requestIdentifiers, }) {
        try {
            const database = (0, app_1.getDbInstance)();
            const generationDataCollection = database.collection("_generation_requests");
            const batchDataCollection = database.collection("_batch_data");
            yield generationDataCollection.deleteMany({
                $or: requestIdentifiers,
            });
            yield batchDataCollection.deleteMany({ status: "completed" });
        }
        catch (error) {
            console.error("Error occurred while cleaning up the batch data:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to clean up batch data: ${errorMessage}`);
        }
    });
}
//# sourceMappingURL=clean_up_batch_data.js.map