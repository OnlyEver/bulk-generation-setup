"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardData = void 0;
const cardData = () => {
    return {
        _id: "asa",
        id: "batch_req_6797455ad974819080ef387ecf489325",
        custom_id: '{"_source":"6753b17a7d070c44ecf24f9e","request_type":{"type":"depth","n":1,"bloom_level":2}}',
        response: {
            status_code: 200,
            request_id: "ff4ded26359d3af9c8d1319fc809255b",
            body: {
                id: "chatcmpl-AuEO4tr5ZWiEqr0SDl2O6FOj1xSms",
                object: "chat.completion",
                created: 1737965036,
                model: "gpt-4o-mini-2024-07-18",
                choices: [
                    {
                        index: 0,
                        message: {
                            role: "assistant",
                            content: '{\n    "test_cards": [\n        {\n            "type": "mcq",\n            "card_content": {\n                "prompt": "Where did apples originate?",\n                "choices": [\n                    {"choice": "North America", "is_correct": false},\n                    {"choice": "Central Asia", "is_correct": true},\n                    {"choice": "Europe", "is_correct": false},\n                    {"choice": "Africa", "is_correct": false}\n                ],\n                "explanation": "Apples originated from *Malus sieversii*, which is found in Central Asia, specifically Kazakhstan and nearby regions. This is critical in understanding the historical context of apple cultivation."\n            },\n            "concepts": [],\n            "facts": ["Apples originated from *Malus sieversii* in Central Asia."]\n        },\n        {\n            "type": "flash",\n            "card_content": {\n                "front": "What are the primary storage conditions for harvested apples to keep them fresh long-term?",\n                "back": "Apples can be stored long-term using controlled atmosphere with low oxygen and high humidity levels.",\n                "explanation": "Controlled atmosphere storage slows the ripening process of apples by reducing respiration rates and ethylene production, allowing for longer shelf life during storage."\n            },\n            "concepts": [],\n            "facts": ["Harvested apples can be stored long-term using controlled atmosphere."]\n        },\n        {\n            "type": "match",\n            "card_content": [\n                {\n                    "left_item": "Apples",\n                    "right_item": "14% carbohydrates"\n                },\n                {\n                    "left_item": "Low fat",\n                    "right_item": "Negligible protein"\n                },\n                {\n                    "left_item": "Apple cultivation",\n                    "right_item": "Controlled atmosphere storage"\n                }\n            ],\n            "concepts": [],\n            "facts": [\n                "Apples have low fat and protein but are 14% carbohydrates.",\n                "Harvested apples can be stored long-term using controlled atmosphere."\n            ]\n        }\n    ]\n}',
                            refusal: null,
                        },
                        logprobs: null,
                        finish_reason: "stop",
                    },
                ],
                usage: {
                    prompt_tokens: 11828,
                    completion_tokens: 421,
                    total_tokens: 12249,
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
                system_fingerprint: "fp_72ed7ab54c",
            },
        },
        error: null,
    };
};
exports.cardData = cardData;
//# sourceMappingURL=depth_data.js.map