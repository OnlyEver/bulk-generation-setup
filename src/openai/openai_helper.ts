import OpenAI from "openai";


var openai: OpenAI;
export const setOpenAIKey = (openaiKey: string) => {
    openai = new OpenAI({
        apiKey: openaiKey,
    });
}
export const openAI = (): OpenAI => openai;