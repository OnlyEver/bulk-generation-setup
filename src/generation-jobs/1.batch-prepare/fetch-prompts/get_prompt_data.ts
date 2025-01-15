import { database } from "../../../mongodb/connection";
import { ObjectId } from "mongodb";

export async function getPromptData(promptIds: Array<string>) : Promise<string> {
    const db =  database();
    const promptCollection = db.collection('_prompts');

    // Convert string IDs to ObjectId
    const objectIds = promptIds.map((id) => new ObjectId(id));

    let result = await promptCollection
        .aggregate([
            {
                /// match the ids of prompt docs
                $match: {
                    _id: {
                        $in: objectIds,
                    },
                },
            },
            {
                /// create a new field allContent(in memory) and pushes the "prompt" field from _prompt doc
                $group: {
                    _id: null,
                    allContent: { $push: "$prompt" },
                },
            },
            {
                /// concat each element in above created `allContent temp field`, and update that to "concatenatedContent"(temp field)
                $project: {
                    concatenatedContent: {
                        $reduce: {
                            input: "$allContent",
                            initialValue: "",
                            in: { $concat: ["$$value", "$$this"] },
                        },
                    },
                },
            },
        ])
        .toArray();


    return result.length > 0 ? result[0].concatenatedContent : "";
}
