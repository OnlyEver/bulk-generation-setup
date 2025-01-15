import { BSON, WithId } from "mongodb";
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export declare function prepareBatchForCard(response: any[], docs: WithId<BSON.Document>[]): Promise<any>;
