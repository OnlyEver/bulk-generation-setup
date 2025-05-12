export type MongoConceptFactSource = {
    text: string;
    type: "concept" | "fact";
    reference: string;
    id: string;
};
export type MongoConceptFactCards = {
    text: string;
    type: "concept" | "fact";
    id: string;
};
