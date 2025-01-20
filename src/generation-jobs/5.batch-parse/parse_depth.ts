export function parseDepth(rawResponse: RawResponse) {
  try {
    const requestId = rawResponse.request_id;
    const response = rawResponse.response;
  } catch (e: any) {
    throw Error(e.message);
  }
}
