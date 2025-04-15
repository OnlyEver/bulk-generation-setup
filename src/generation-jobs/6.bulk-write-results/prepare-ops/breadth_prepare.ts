import { ObjectId } from "mongodb";

export function writeDBOpsForBreadth(data: ParsedResponse): any[] {
  const reqId = data.requestIdentifier;
  var metadata = data.metadata;
  const sourceId = reqId._source;
  const generatedData = data.generated_data as TypologyResponse;
  const dbOPS: any[] = [];
  const facts: { concept_text: string; reference: string }[] =
    generatedData.facts.map((e) => {
      return {
        concept_text: e.fact_text,
        reference: e.reference,
      };
    });
  const concepts: any[] = [...generatedData.concepts, ...facts];

  /// write metadata to generation info
  dbOPS.push({
    collection: "_source",
    query: {
      updateOne: {
        filter: {
          _id: new ObjectId(sourceId),
        },
        update: {
          $addToSet: {
            generation_info: metadata,
            "source_taxonomy.fields": { $each: generatedData.field },
            "source_taxonomy.concepts": { $each: concepts },
            "source_taxonomy.facts": { $each: generatedData.facts },
            summary_cards: {
              $each: generatedData.summary_cards,
            },
          },
          $set: {
            "source_taxonomy.generate_cards": generatedData.generate_cards,
          },
        },
        upsert: true,
      },
    },
  });
  return dbOPS;
}
