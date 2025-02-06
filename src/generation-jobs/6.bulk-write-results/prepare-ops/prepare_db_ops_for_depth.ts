import { ObjectId } from "mongodb";
import { getDbInstance } from "../../../app";

export async function writeDBOpsForDepth(data: ParsedResponse): Promise<any[]> {
  const database = getDbInstance();
  const reqId = data.requestIdentifier;
  var metadata = data.metadata;
  const sourceId = reqId._source;
  const generatedData = data.generated_data as CardGenResponse;
  const dbOPS: any[] = [];
  const momoUserID = "11111111";
  const momoUserObjectID = new ObjectId("66543e0a6d7bc33e60d12e31");
  const sourceCollection = database.collection("_source");

  try {
    const source = await sourceCollection.findOne({
      _id: new ObjectId(sourceId),
    });
    if (source) {
      /// prepare cards objects
      const cardsObjects = generatedData.cards_data.map((elem) => {
        return {
          _id: new ObjectId(),
          _source: new ObjectId(sourceId),
          _owners: [momoUserObjectID],
          type: elem.type,
          source_info: {
            source_heading: elem.heading,
            source_title: source?.title,
          },
          content: elem.content,
          ctime: new Date(),
          mtime: new Date(),
          _access_to: [],
          ai_generated: true,
          explanation: elem.explanation,
          generated_info: {
            concepts: elem.concepts,
            facts: elem.facts,
          },
        };
      });

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
                "source_taxonomy.concepts": generatedData.missing_concepts,
                "source_taxonomy.facts": generatedData.missing_facts,
              },
            },
            upsert: true,
          },
        },
      });

      // insert to _cards
      cardsObjects.forEach((elem) => {
        dbOPS.push({
          collection: "_cards",
          query: {
            insertOne: elem,
          },
        });
      });

      const createdCardsIds = cardsObjects.map((elem) => ({
        _id: elem._id,
        position: getHeadingPosition(
          elem.source_info.source_heading,
          source.headings
        ),
      }));

      // update to test set and _ai_cards

      dbOPS.push({
        collection: "_source",
        query: {
          updateOne: {
            filter: {
              _id: new ObjectId(sourceId),
            },
            update: {
              $addToSet: {
                _ai_cards: {
                  $each: createdCardsIds,
                },
                test_set: {
                  $each: createdCardsIds,
                },
              },
            },
          },
        },
      });
    }

    return dbOPS;
  } catch (e) {
    return [];
  }
}

function getHeadingPosition(headingText: string, headings: string[]): number {
  if (headings) {
    return headings.indexOf(headingText);
  } else {
    return -1;
  }
}
