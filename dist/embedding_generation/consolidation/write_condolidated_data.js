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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteConsolidatedData = void 0;
const qdrant_services_1 = __importDefault(require("../../services/qdrant_services"));
class WriteConsolidatedData {
    writeConsolidatedData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.global_updates.length > 0) {
                yield this.writeGlobalUpdates(data.global_updates);
            }
            if (data.global_inserts.length > 0) {
                yield this.writeGlobalInserts(data.global_inserts);
            }
            return {
                status: "success",
            };
        });
    }
    writeGlobalUpdates(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const operations = data.map((e) => {
                return {
                    set_payload: {
                        points: [e.id],
                        payload: {
                            text: e.currentPayload.text,
                            _sources: [e.sourceIdToAdd, ...e.currentPayload._sources],
                        },
                    },
                };
            });
            yield qdrant_services_1.default.batchUpdate("concepts-vectors", {
                wait: true,
                operations: operations,
            });
        });
    }
    writeGlobalInserts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield qdrant_services_1.default.upsert("concepts-vectors", {
                wait: true,
                points: data,
            });
        });
    }
    wiriteToMondo(source_taxonomy, generation_requests, source_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mondo_data = source_taxonomy.map((e) => {
                return {
                    id: e.id,
                };
            });
        });
    }
}
exports.WriteConsolidatedData = WriteConsolidatedData;
//# sourceMappingURL=write_condolidated_data.js.map