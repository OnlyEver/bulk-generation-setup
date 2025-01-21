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
exports.convertParsedArrayToDbOperations = convertParsedArrayToDbOperations;
const breadth_prepare_1 = require("./breadth_prepare");
const prepare_db_ops_for_depth_1 = require("./prepare_db_ops_for_depth");
function convertParsedArrayToDbOperations(parsedArray) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbOperations = [];
            for (const elem of parsedArray) {
                const reqId = elem.requestIdentifier;
                const reqType = reqId.request_type;
                if (reqType.type === "breadth") {
                    // to add to set for concepts,facts,
                    // write to generation_info for source
                    const dbOps = (0, breadth_prepare_1.writeDBOpsForBreadth)(elem);
                    dbOperations.push(...dbOps);
                }
                else if (reqType.type === "depth") {
                    // to add to set for _ai_Cards
                    // create _cards objects and write to _cards
                    // write to generation_info for source
                    const dbOps = yield (0, prepare_db_ops_for_depth_1.writeDBOpsForDepth)(elem);
                    dbOperations.push(...dbOps);
                }
            }
            return {
                _cards: dbOperations
                    .filter((elem) => elem.collection === "_cards")
                    .map((elem) => elem.query),
                _source: dbOperations
                    .filter((elem) => elem.collection === "_source")
                    .map((elem) => elem.query),
            };
        }
        catch (e) {
            console.error("Error occurred while converting the parsed array to db operations:", e);
            throw e;
        }
    });
}
//# sourceMappingURL=parsed_response_to_db_operations.js.map