export declare class WriteConsolidatedData {
    writeConsolidatedData(data: {
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
    }): Promise<{
        status: string;
    }>;
    writeGlobalUpdates(data: {
        id: string;
        currentPayload: {
            _sources: string[];
            text: string;
        };
        sourceIdToAdd: string;
    }[]): Promise<void>;
    writeGlobalInserts(data: {
        id: string;
        vector: number[];
        payload: {
            _sources: string[];
            text: string;
        };
    }[]): Promise<void>;
    wiriteToMondo(source_taxonomy: any[], generation_requests: any[], source_id: string): Promise<void>;
}
