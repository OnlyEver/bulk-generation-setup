"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDepth = parseDepth;
function parseDepth(rawResponse) {
    try {
        const requestId = rawResponse.request_id;
        const response = rawResponse.response;
        const usage = response.usage;
        const generatedData = response.choices[0].message;
        return {
            request_id: requestId,
            // metadata:null,
            generated_data: [],
        };
    }
    catch (e) {
        throw Error(e.message);
    }
}
