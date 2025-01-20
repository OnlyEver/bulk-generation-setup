type RequestId = {
  source_id: string;
  request_type: {
    type: string;
    bloom_level?: number;
    n: number;
  };
};
