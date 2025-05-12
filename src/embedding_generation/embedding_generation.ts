import { openAI } from "../openai/openai_helper";

interface EmbeddingResponse {
    concepts_facts: {
        text: string;
        type: string;
        embedding: number[];
        reference: string;
    }[];
    metadata: {
        req_time: string;
        req_type: {
            type: string;
        };
        req_tokens: number;
        res_tokens: number;
        model: string;
        usage: any;
    };
}

export async function generateEmbeddings(
    concepts_facts: { text: string; type: string; reference: string }[]
): Promise<EmbeddingResponse> {
    const texts = concepts_facts.map((e: any) => e.text);
    const response = await openAI().embeddings.create({
        model: "text-embedding-3-large",
        input: texts,
        dimensions: 512,
    });

    const embeddings = response.data.sort((a: any) => a.index);
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
}

