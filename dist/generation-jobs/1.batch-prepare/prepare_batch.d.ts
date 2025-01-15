import { Db } from "mongodb";
/**
 * Prepares a batch file for processing by generating a set of data requests
 * from documents in the source collection and writing them to a local file.
 */
export declare function prepareBatch(): Promise<void>;
export declare const fetchSourceDocuments: (docs: any[], db: Db) => Promise<any[]>;
