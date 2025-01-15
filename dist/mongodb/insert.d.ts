import { ObjectId } from "mongodb";
export type Card = {
    id: ObjectId;
    heading?: string;
    content: Object;
    concepts: Array<any>;
    facts: Array<any>;
    bloomlevel: any;
    displayTitle?: string;
};
export declare function insertSourceTypology(parsedTypology: Object, sourceId: string): Promise<void>;
export declare function insertCard(parsedCardData: Card, sourceId: string): Promise<void>;
