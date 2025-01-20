export function parseDepth(rawResponse: RawResponse): ParsedResponse {
  try {
    const requestId = rawResponse.request_id;
    const response = rawResponse.response;
    const usage = response.usage;
    const generatedData = response.choices[0].message;
    return {
      request_id: requestId,
      // metadata:null,
      generated_data: [],
    };
  } catch (e: any) {
    throw Error(e.message);
  }
}
