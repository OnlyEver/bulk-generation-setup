"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchStatusEnum = void 0;
var BatchStatusEnum;
(function (BatchStatusEnum) {
    BatchStatusEnum["IN_PROGRESS"] = "in_progress";
    BatchStatusEnum["COMPLETED"] = "completed";
    BatchStatusEnum["FAILED"] = "failed";
    BatchStatusEnum["CANCELLED"] = "cancelled";
    BatchStatusEnum["UNKNOWN"] = "unknown";
    BatchStatusEnum["FINALZING"] = "finalizing";
    BatchStatusEnum["VALIDATING"] = "validating";
    BatchStatusEnum["EXPIRED"] = "expired";
})(BatchStatusEnum || (exports.BatchStatusEnum = BatchStatusEnum = {}));
