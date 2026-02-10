import { Uuid } from '../../Uuid.js';

interface CypherPathSubsetStepResult {
  paths: {
    nodeIds: Uuid[];
    relationIds: Uuid[];
  };
}

export { CypherPathSubsetStepResult };
