import { SearchStepType } from '../Enum/index.js';

type SearchStep = {
  type: SearchStepType;
  query?: null | string | Record<string, unknown>;
  parameters?: Record<string, unknown>;
};

export { SearchStep };
