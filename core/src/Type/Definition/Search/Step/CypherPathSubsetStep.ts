import { Step } from './Step.js';

interface CypherPathSubsetStep extends Step {
  type: 'cypher-path-subset';
  query: string;
}

export { CypherPathSubsetStep };
