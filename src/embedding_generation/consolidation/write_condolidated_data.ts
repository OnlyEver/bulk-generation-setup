import qdrantClient from "../../services/qdrant_services";

export class WriteConsolidatedData {
    async writeConsolidatedData(
        data: {
            source_taxonomy: {
                id: string;
                text: string;
                type: string;
                reference: string;
            }[];
            global_updates: {
                id: string;
                currentPayload: {
                    _sources: string[];
                    text: string;
                };
                sourceIdToAdd: string;
            }[];
            global_inserts: {
                id: string;
                vector: number[];
                payload: {
                    _sources: string[];
                    text: string;
                };
            }[];
        },

    ) {
        if (data.global_updates.length > 0) {
            await this.writeGlobalUpdates(data.global_updates);
        }
        if (data.global_inserts.length > 0) {
            await this.writeGlobalInserts(data.global_inserts);
        }

        return {
            status: "success",
        };
    }

    async writeGlobalUpdates(
        data: {
            id: string;
            currentPayload: {
                _sources: string[];
                text: string;
            };
            sourceIdToAdd: string;
        }[]
    ) {
        const operations = data.map((e) => {
            return {
                set_payload: {
                    points: [e.id],
                    payload: {
                        text: e.currentPayload.text,
                        _sources: [e.sourceIdToAdd, ...e.currentPayload._sources],
                    },
                },
            };
        });
        await qdrantClient.batchUpdate("concepts-vectors", {
            wait: true,
            operations: operations,
        });
    }

    async writeGlobalInserts(
        data: {
            id: string;
            vector: number[];
            payload: {
                _sources: string[];
                text: string;
            };
        }[]
    ) {
        await qdrantClient.upsert("concepts-vectors", {
            wait: true,
            points: data,
        });

    }

    async wiriteToMondo(
        source_taxonomy: any[],
        generation_requests: any[],
        source_id: string
    ) {
        const mondo_data = source_taxonomy.map((e) => {
            return {
                id: e.id,
            };
        });
    }
}
