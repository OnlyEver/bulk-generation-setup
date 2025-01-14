import { BSON, WithId } from "mongodb";
export declare function sendGeneration(): Promise<{
    generation: string;
}>;
export declare function sendCardGeneration(response: any[], docs: WithId<BSON.Document>[]): Promise<void>;
