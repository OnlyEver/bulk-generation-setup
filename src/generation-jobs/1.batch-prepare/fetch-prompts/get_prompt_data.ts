import { database } from "../../../mongodb/connection";
import { ObjectId } from "mongodb";

/**
 * Function for getting the `prompt` field from the `_prompts` collection
 * by passing an array of object ids 
 * 
 * @param promptIds - An array of string (Object Ids of the prompt documents)
 */
export async function getPromptData(promptIds: Array<string>): Promise<string> {
    const promptCollection = database.collection('_prompts');

    // Convert string IDs to ObjectId
    const objectIds = promptIds.map((id) => new ObjectId(id));

    let result = await promptCollection
        .aggregate([
            {
                // Match the IDs of prompt docs
                $match: {
                    _id: { $in: objectIds },
                },
            },
            {
                // Assign an order based on the index in objectIds array
                $addFields: {
                    order: { $indexOfArray: [objectIds, "$_id"] },
                },
            },
            {
                // Sort the results based on the original order
                $sort: { order: 1 },
            },
            {
                // Group all prompts into an array while maintaining order
                $group: {
                    _id: null,
                    allContent: { $push: "$prompt" },
                },
            },
            {
                // Concatenate all prompts in order
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


    return result.length > 0 ? result[0].concatenatedContent : '';
}
