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
exports.generateEmbeddings = generateEmbeddings;
const openai_helper_1 = require("../openai/openai_helper");
function generateEmbeddings(concepts_facts) {
    return __awaiter(this, void 0, void 0, function* () {
        const texts = concepts_facts.map((e) => e.text);
        const response = yield (0, openai_helper_1.openAI)().embeddings.create({
            model: "text-embedding-3-large",
            input: texts,
            dimensions: 512,
        });
        const embeddings = response.data.sort((a) => a.index);
        const model = response.model;
        const usage = response.usage;
        const embeddings_map = [];
        for (let i = 0; i < concepts_facts.length; i++) {
            embeddings_map.push({
                text: concepts_facts[i].text,
                type: concepts_facts[i].type,
                embedding: embeddings[i].embedding,
                reference: concepts_facts[i].reference,
            });
        }
        // return embeddings_map;
        return {
            concepts_facts: embeddings_map,
            metadata: {
                req_time: new Date().toISOString(),
                req_type: {
                    type: "embedding",
                },
                req_tokens: usage.prompt_tokens,
                res_tokens: usage.total_tokens,
                model: model,
                usage: usage,
            },
        };
    });
}
//# sourceMappingURL=embedding_generation.js.map