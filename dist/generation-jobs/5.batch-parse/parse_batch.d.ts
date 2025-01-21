export declare function parseBatchResponse(generatedResponses: any[]): Promise<{
    batch_id: string;
    parsed_response: ParsedResponse[];
}>;
