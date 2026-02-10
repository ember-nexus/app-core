import { Step } from './Step.js';
import { Uuid } from '../../Uuid.js';

interface ElementHydrationStep extends Step {
  type: 'element-hydration';
  query: {
    elementIds: Uuid[] | string;
  };
}

export { ElementHydrationStep };
