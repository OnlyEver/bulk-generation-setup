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
exports.parseResponse = parseResponse;
function parseResponse(generatedResponses) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const parsedResponses = await Promise.all(
            //   generatedResponse.map(async (response) => {
            //     const body = response["response"]["body"];
            //     const content = body.choices[0]["message"]["content"];
            //     const parsedContent = JSON.parse(content);
            //     return parsedContent;
            //   })
            // );
            // return parsedResponses;
            for (const elem of generatedResponses) {
                const customId = extractCustomId(elem.custom_id);
                if (customId.request_type.type === "depth") {
                    // handle typology parsing
                }
                else if (customId.request_type.type === "breadth") {
                    // handle breadth parsing
                }
            }
        }
        catch (e) {
            throw Error(e.message);
        }
    });
}
function extractCustomId(customId) {
    const customIdData = JSON.parse(customId);
    return {
        source_id: customIdData.source_id,
        request_type: {
            type: customIdData.request_type.type,
            bloom_level: customIdData.request_type.bloom_level,
            n: customIdData.request,
        },
    };
}
