export const cleanRequestsIdentifier = (identifier: RequestId): any => {
  let requestId: any;
  if (identifier.request_type.type == "depth") {
    requestId = {
      _source: identifier._source,
      "request_type.type": identifier.request_type.type,
      "request_type.bloom_level": identifier.request_type.bloom_level,
      "request_type.n": identifier.request_type.n,
    };
  } else {
    requestId = {
      _source: identifier._source,
      "request_type.type": identifier.request_type.type,
      "request_type.n": identifier.request_type.n,
    };
  }
  return requestId;
};
