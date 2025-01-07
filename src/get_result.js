import OpenAI from "openai";
import { config } from "../config.js";


export async function getResult(fileid) {
    const openai = new OpenAI({
        apiKey: config.openAiKey
    });
    const fileResponse = await openai.files.content(fileid);
    const fileContents = await fileResponse.text();

    console.log(fileContents);


    console.log(batch);
    return "Batch will be prepared here";
}
