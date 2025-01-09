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
exports.sendGeneration = sendGeneration;
const delay_helper_1 = require("../helper_function/delay_helper");
const create_batch_1 = require("./2.batch-creation/create_batch");
const prepare_batch_1 = require("./1.batch-prepare/prepare_batch");
const get_result_1 = require("./4.batch-result/get_result");
const check_batch_status_1 = require("./3.batch-status/check_batch_status");
const cancel_batch_1 = require("./3.batch-status/cancel_batch");
const batch_status_1 = require("../enums/batch_status");
function sendGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, prepare_batch_1.prepareBatch)();
        const batch = yield (0, create_batch_1.createBatch)();
        console.log("Batch id: ", batch.id);
        const batchStatus = yield poolBatchStatus("batch_677e2d19065081909e98849d40dd11ed");
        if (batchStatus.status == batch_status_1.BatchStatusEnum.COMPLETED) {
            //get results
        }
        else {
            //handle failure
        }
        const fileData = yield (0, get_result_1.getResult)(batchStatus.file);
        return fileData;
    });
}
function poolBatchStatus(batchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const batchStatus = yield (0, check_batch_status_1.checkBatchStatus)(batchId);
        console.log("pooling");
        if (batchStatus.status == batch_status_1.BatchStatusEnum.FAILED) {
            //cancel batch
            yield (0, cancel_batch_1.cancelBatch)(batchId);
            return {
                id: batchStatus.id,
                status: batch_status_1.BatchStatusEnum.FAILED,
                file: batchStatus.error_file_id,
            };
        }
        else if (batchStatus.status != batch_status_1.BatchStatusEnum.COMPLETED) {
            yield (0, delay_helper_1.delay)(10);
            return yield poolBatchStatus(batchId);
        }
        else if (batchStatus.status == batch_status_1.BatchStatusEnum.COMPLETED) {
            return {
                id: batchStatus.id,
                status: batch_status_1.BatchStatusEnum.COMPLETED,
                file: batchStatus.output_file_id,
            };
        }
        else {
            return {
                id: "sda",
                status: batch_status_1.BatchStatusEnum.FAILED,
            };
        }
    });
}
