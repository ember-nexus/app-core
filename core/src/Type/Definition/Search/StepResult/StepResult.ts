import { CypherPathSubsetStepResult } from './CypherPathSubsetStepResult.js';
import { ElasticsearchQueryDSLMixinStepResult } from './ElasticsearchQueryDSLMixinStepResult.js';
import { ElementHydrationStepResult } from './ElementHydrationStepResult.js';

type StepResult = CypherPathSubsetStepResult | ElasticsearchQueryDSLMixinStepResult | ElementHydrationStepResult;

export { StepResult };
