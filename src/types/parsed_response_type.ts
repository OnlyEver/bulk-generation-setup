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
  generated_data: TypologyResponse | CardGenResponse;
};

type TypologyResponse = {
  field: Array<{
    [key: string]: string | boolean;
    reconcile: boolean;
  }>;
  concepts: Array<{
    concept_text: string;
    reference: string;
  }>;
  facts: Array<{
    fact_text: string;
    reference: string;
  }>;
  generate_cards: {
    state: boolean;
    reason: string;
  };
  summary_cards: {
    title: string;
    text: string;
    reference: string;
  }[];
};

type CardGenResponse = {
  cards_data: any[];
  missing_facts: Array<{
    concept_text: string;
    reference: string;
  }>;
  missing_concepts: Array<{
    fact_text: string;
    reference: string;
  }>;
};
