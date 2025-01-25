import { Collection, ObjectId } from "mongodb";
import { database } from "../../mongodb/connection";
import { lastWhere } from "../../utils/list_last_where";

/**
 * Function for populating the queue with generation requests based on the depth (card_gen)
 * and breadth (typology) of the source
 *
 * @async
 * @param sourceId - The `_id` of the source
 */
export async function populateQueue(sourceId: string) {
  const sourceCollection = database.collection("_source");
  const generationRequests = database.collection("_generation_requests");
  const cardCollection: Collection<Document> = database.collection("_card");

  let documents = []; // Array of documents to be inserted in the generation_requests collection

  try {
    const source = await sourceCollection.findOne(
      {
        _id: new ObjectId(sourceId),
      },
      {
        projection: {
          generation_info: 1,
          view_time: 1,
          source_taxonomy: 1,
          _ai_cards: 1,
        },
      }
    );

    if (source) {
      const generationInfo = source.generation_info;
      const viewTime = source.view_time;
      const sourceTaxonomy = source.source_taxonomy;
      const aiCards = (source._ai_cards ?? []).map(
        (elem: { _id: ObjectId; position: number }) => elem._id
      );

      if (Array.isArray(generationInfo) && generationInfo.length > 0) {
        const lastBreadthRequest = lastWhere(
          generationInfo,
          (item) => item.req_type.type === "breadth"
        );
        const calculatedViewTime = Math.floor(viewTime / 300);

        // If the breadth request or source taxonomy exists
        if (lastBreadthRequest || sourceTaxonomy) {
          if (lastBreadthRequest.req_type.n <= calculatedViewTime) {
            _insertBreadthRequest((lastBreadthRequest.req_type?.n ?? 0) + 1);
          } else {
            const depthDocuments = await handleDepthRequest(
              sourceId,
              sourceTaxonomy,
              generationInfo,
              aiCards,
              cardCollection
            );
            documents.push(...depthDocuments);
          }
        } else {
          /// Insert the initial breadth request with n = 1
          _insertBreadthRequest(1);
        }

        const genReqs = await handleUniqueInsertions(documents);
      }
    }

    console.log("Documents: ", documents);
  } catch (error) {
    console.log("Error while populating queue: ", error);
    throw Error;
  }

  function _insertBreadthRequest(n: number) {
    documents.push({
      _source: sourceId,
      ctime: new Date(),
      status: "created",
      request_type: {
        type: "breadth",
        n: n,
      },
    });
  }
}

/**
 * Handles the depth request generation by determining missing concepts and facts for each bloom level.
 *
 * @async
 * @param sourceId - The `_id` of the source.
 * @param sourceTaxonomy - The taxonomy data of the source.
 * @param generationInfo - Information about previous generation requests.
 * @param aiCards - Array of AI card ObjectIds for the source.
 * @param cardCollection - The collection containing card data.
 * @returns {Promise<any[]>} - A promise resolving to an array of generation request documents.
 */
async function handleDepthRequest(
  sourceId: string,
  sourceTaxonomy: any,
  generationInfo: any[],
  aiCards: ObjectId[],
  cardCollection: Collection<Document>
): Promise<any[]> {
  try {
    let documents: any[] = [];

    const concepts = sourceTaxonomy.concepts ?? [];
    const facts = sourceTaxonomy.facts ?? [];

    const conceptTextArray = concepts.map(
      (concept: { concept_text: string; reference: string }) =>
        concept.concept_text
    );
    const factTextArray = facts.map(
      (fact: { fact_text: string; reference: string }) => fact.fact_text
    );

    const bloomLevelCards = await cardCollection
      .aggregate([
        { $match: { _id: { $in: aiCards } } },
        {
          $group: {
            _id: "$generated_info.blooms_level",
            cards: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, level: "$_id", cards: 1 } },
      ])
      .toArray();

    if (sourceTaxonomy.generate_cards.state) {
      let maxRequestsForBloom = 5;

      let levelConcepts = []; /// An array of concept_text according to the bloom level
      let levelFacts = []; /// An array of fact_text according to the bloom level

      for (let bloom = 1; bloom <= 5; bloom++) {
        console.log("Bloom level: ", bloom);

        let missingConcepts = [];
        let missingFacts = [];

        const lastDepthRequest = lastWhere(
          generationInfo,
          (item) =>
            item.req_type?.type === "depth" &&
            item.req_type?.bloom_level === bloom
        );

        if (lastDepthRequest) {
          if ((lastDepthRequest.req_type?.n ?? 0) <= maxRequestsForBloom) {
            let levelCards = [];
            levelCards =
              bloomLevelCards.find((item) => item.level === bloom)?.cards || [];

            if (levelCards.length > 0) {
              for (let card of levelCards) {
                if (card.generated_info.concepts) {
                  for (let concept of card.generated_info.concepts) {
                    if (concept.concept_text) {
                      levelConcepts.push(concept.concept_text);
                    }
                  }
                }

                if (card.generated_info.facts) {
                  for (let fact of card.generated_info.facts) {
                    if (fact.fact_text) {
                      levelFacts.push(fact.fact_text);
                    }
                  }
                }
              }

              if (levelConcepts.length > 0) {
                const c = conceptTextArray.filter(
                  (concept: string) => !levelConcepts.includes(concept)
                );
                missingConcepts = [];
                missingConcepts.push(...c);
              }

              if (levelFacts.length > 0) {
                const f = factTextArray.filter(
                  (fact: string) => !levelFacts.includes(fact)
                );
                missingFacts = [];
                missingFacts.push(...f);
              }

              if (missingConcepts.length > 0 || missingFacts.length > 0) {
                const missingConceptsData = missingConcepts.map(
                  (concept: string) => {
                    return concepts.find(
                      (e: any) => e.concept_text === concept
                    );
                  }
                );
                const missingFactsData = missingFacts.map((fact: string) => {
                  return facts.find((e: any) => e.fact_text === fact);
                });

                documents.push({
                  _source: sourceId,
                  ctime: new Date(),
                  status: "created",
                  request_type: {
                    type: "depth",
                    bloom_level: bloom,
                    n: (lastDepthRequest?.n ?? 0) + 1,
                  },
                  params: {
                    missing_concepts: missingConceptsData,
                    missing_facts: missingFactsData,
                  },
                });
              }
            }
          }
        } else {
          documents.push({
            _source: sourceId,
            ctime: new Date(),
            status: "created",
            request_type: {
              type: "depth",
              bloom_level: bloom,
              n: 1,
            },
            params: {
              missing_concepts: concepts,
              missing_facts: facts,
            },
          });
        }

        maxRequestsForBloom--;
      }
    }

    return documents;
  } catch (error) {
    console.log("Error while handling depth request: ", error);
    throw error;
  }
}
async function handleUniqueInsertions(documents: any[]) {
  const generationRequests = database.collection("_generation_requests");
  for (const doc of documents) {
    const existingDoc = await generationRequests.findOne({
      _source: doc._source,
      request_type: doc.request_type,
    });

    if (!existingDoc) {
      await generationRequests.insertOne(doc);
      console.log(`Inserted document: ${JSON.stringify(doc)}`);
    } else {
      console.log(
        `Duplicate document found for _source: ${doc._source}, skipping insertion.`
      );
    }
  }
}
