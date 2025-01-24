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
exports.checkBatchStatus = checkBatchStatus;
const openai_helper_1 = require("../../openai/openai_helper");
const app_1 = require("../../app");
function checkBatchStatus(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const bacthList = await openAI().batches.list();
            const batch = yield (0, openai_helper_1.openAI)().batches.retrieve(batchId);
            const database = (0, app_1.getDbInstance)();
            const collection = database.collection("_batch_data");
            yield collection.updateOne({ id: batchId }, { $set: batch }, { upsert: true });
            return batch;
        }
        catch (e) {
            throw Error(e.message);
        }
    });
}
//# sourceMappingURL=check_batch_status.js.map