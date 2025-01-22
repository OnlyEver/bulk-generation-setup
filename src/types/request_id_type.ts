type RequestId = {
  _source: string;
  request_type: RequestType;
  params?: any;
};

type RequestType = {
  type: string;
  bloom_level?: number;
  n: number;
};
