export declare const promptString: string;
/**
 * Returns prompts for card generation based on the bloom level
 *
 * @param bloomLevel - Must be from 1 to 6
 */
export declare function returnCardGenPrompt(bloomLevel: number): Promise<string>;
