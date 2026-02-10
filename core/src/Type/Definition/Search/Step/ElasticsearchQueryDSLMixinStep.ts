import { Step } from './Step.js';

interface ElasticsearchQueryDSLMixinStep extends Step {
  type: 'elasticsearch-query-dsl-mixin';
  query: Record<string, unknown>;
  parameters?: {
    nodeTypes?: string[];
    relationTypes?: string[];
    page?: number;
    pageSize?: number;
    minScore?: null | number;
  };
}

export { ElasticsearchQueryDSLMixinStep };
