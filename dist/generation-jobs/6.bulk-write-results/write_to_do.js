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
exports.handleBulkWrite = handleBulkWrite;
const app_1 = require("../../app");
const parsed_response_to_db_operations_1 = require("./prepare-ops/parsed_response_to_db_operations");
function handleBulkWrite(parsedResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = (0, app_1.getDbInstance)();
            const cardCollection = database.collection("_cards");
            const sourceCollection = database.collection("_source");
            const dbOps = yield (0, parsed_response_to_db_operations_1.convertParsedArrayToDoOperations)(parsedResponse);
            const cardsOps = dbOps._cards;
            const sourceOps = dbOps._source;
            if (cardsOps.length > 0) {
                yield cardCollection.bulkWrite(cardsOps);
            }
            else if (sourceOps.length > 0) {
                yield sourceCollection.bulkWrite(sourceOps);
            }
        }
        catch (e) {
            console.error("Error occurred while converting the parsed array to db operations:", e);
            throw e;
        }
    });
}
//# sourceMappingURL=write_to_do.js.map