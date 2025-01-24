/**
 * Function for getting the `prompt` field from the `_prompts` collection
 * by passing an array of object ids
 *
 * @param promptIds - An array of string (Object Ids of the prompt documents)
 */
export declare function getPromptData(promptIds: Array<string>): Promise<string>;
