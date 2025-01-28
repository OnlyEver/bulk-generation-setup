"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanRequestsIdentifier = void 0;
const cleanRequestsIdentifier = (identifier) => {
    let requestId;
    if (identifier.request_type.type == "depth") {
        requestId = {
            _source: identifier._source,
            "request_type.type": identifier.request_type.type,
            "request_type.bloom_level": identifier.request_type.bloom_level,
            "request_type.n": identifier.request_type.n,
        };
    }
    else {
        requestId = {
            _source: identifier._source,
            "request_type.type": identifier.request_type.type,
            "request_type.n": identifier.request_type.n,
        };
    }
    return requestId;
};
exports.cleanRequestsIdentifier = cleanRequestsIdentifier;
//# sourceMappingURL=identifier_for_clearing_requests.js.map