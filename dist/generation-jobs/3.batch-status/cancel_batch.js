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
exports.cancelBatch = cancelBatch;
const openai_helper_1 = require("../../openai/openai_helper");
function cancelBatch(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = yield (0, openai_helper_1.openAI)().batches.cancel(batchId);
        return batch;
    });
}
//# sourceMappingURL=cancel_batch.js.map