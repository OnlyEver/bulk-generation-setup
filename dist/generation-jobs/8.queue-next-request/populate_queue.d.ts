/**
 * Function for populating the queue with generation requests based on the depth (card_gen)
 * and breadth (typology) of the source
 *
 * @async
 * @param sourceId - The `_id` of the source
 */
export declare function populateQueue(sourceId: string, viewTimeThreshold: number): Promise<void>;
