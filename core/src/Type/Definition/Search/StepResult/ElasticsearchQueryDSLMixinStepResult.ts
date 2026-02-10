import { Uuid } from '../../Uuid.js';

interface ElasticsearchQueryDSLMixinStepResult {
  elements: {
    id: Uuid;
    type: string;
    metadata: {
      score: number;
    };
  }[];
  totalHits: number;
  maxScore: number;
}

export { ElasticsearchQueryDSLMixinStepResult };
