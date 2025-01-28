"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxonomyData = void 0;
const taxonomyData = () => ({
    id: "batch_req_678a1a75889c8190b68bd6cd03bc3bd8",
    custom_id: '{"id":"6753b2237d070c44ec059f24","request_type":{"type":"breadth","n":1}}',
    response: {
        status_code: 200,
        request_id: "ce83a7a7294660984de4d7b023c1ffed",
        body: {
            id: "chatcmpl-AqcDsF1aUCEmzsF0VTX92Okkrcbiw",
            object: "chat.completion",
            created: 1737103348,
            model: "gpt-4o-mini-2024-07-18",
            choices: [
                {
                    index: 0,
                    message: {
                        role: "assistant",
                        content: '{\n    "field": ["Transportation", "Engineering & Technology", "History"],\n    "concepts": [\n        {\n            "concept_text": "Definition of a bus",\n            "reference": "Introduction"\n        },\n        {\n            "concept_text": "Types of buses include double-decker and articulated buses.",\n            "reference": "Types"\n        },\n        {\n            "concept_text": "History of buses includes types like horse-drawn, steam, and electric buses.",\n            "reference": "History"\n        },\n        {\n            "concept_text": "Uses of buses include public transport, tourism, and school transport.",\n            "reference": "Uses"\n        },\n        {\n            "concept_text": "Bus manufacturing has evolved with increasing globalization.",\n            "reference": "Manufacture"\n        },\n        {\n            "concept_text": "Buses can be modified for various uses like mobile cafes and learning hubs.",\n            "reference": "Use of retired buses"\n        }\n    ],\n    "facts": [\n        {\n            "fact_text": "The average bus carries between 30 and 100 passengers.",\n            "reference": "Introduction"\n        },\n        {\n            "fact_text": "Buses can have capacities up to 300 passengers.",\n            "reference": "Introduction"\n        },\n        {\n            "fact_text": "The first horse-drawn buses were used from the 1820s.",\n            "reference": "History"\n        },\n        {\n            "fact_text": "The first internal combustion engine buses appeared in 1895.",\n            "reference": "History"\n        },\n        {\n            "fact_text": "Electric trolleybuses were introduced in 1882.",\n            "reference": "History"\n        },\n        {\n            "fact_text": "Buses powered by diesel engines have been common since the 1920s.",\n            "reference": "Propulsion"\n        },\n        {\n            "fact_text": "The first Paris omnibus began service in 1828.",\n            "reference": "First horse omnibus serves"\n        },\n        {\n            "fact_text": "Shillibeer\'s London omnibus began service on July 4, 1829.",\n            "reference": "First horse omnibus serves"\n        }\n    ],\n    "generate_cards": {\n        "state": true,\n        "reason": ""\n    },\n    "summary_cards": [\n        "A bus is a motor vehicle carrying more passengers than cars, used in public transport.",\n        "Bus types include single-decker, double-decker, articulated, and coaches for longer trips.",\n        "The history of buses spans horse-drawn to electric and modern diesel varieties, dating back to the 1820s.",\n        "Buses serve various purposes including public transport, tourism, and school transport.",\n        "Bus manufacturing has become globalized, with standardized designs being produced worldwide.",\n        "Retired buses can be repurposed into mobile cafes, learning centers, or even holiday homes.",\n        "Significant early innovations include the Paris omnibus in 1828 and the first steam buses in the 1830s.",\n        "Buses have influenced urban life and transport practices globally, adapting to local needs."\n    ]\n}',
                        refusal: null,
                    },
                    logprobs: null,
                    finish_reason: "stop",
                },
            ],
            usage: {
                prompt_tokens: 11205,
                completion_tokens: 647,
                total_tokens: 11852,
                prompt_tokens_details: {
                    cached_tokens: 0,
                    audio_tokens: 0,
                },
                completion_tokens_details: {
                    reasoning_tokens: 0,
                    audio_tokens: 0,
                    accepted_prediction_tokens: 0,
                    rejected_prediction_tokens: 0,
                },
            },
            service_tier: "default",
            system_fingerprint: "fp_bd83329f63",
        },
    },
    error: null,
});
exports.taxonomyData = taxonomyData;
//# sourceMappingURL=breadth_test.js.map