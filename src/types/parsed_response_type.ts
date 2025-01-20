type ParsedResponse = {
  requestIdentifier: RequestId;
  metadata?: {
    req_type: RequestType;
    req_time: Date;
    req_tokens: number;
    res_tokens: number;
    model: string;
    status: string;
  };
  generated_data: TypologyResponse | CardGenResponse[];
};

type TypologyResponse = {};
type CardGenResponse = {};
