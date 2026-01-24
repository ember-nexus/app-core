import { Logger } from 'tslog';

import type { LoggerInterface } from '../src/Type/Definition/index.js';

const testLogger = new Logger({
  name: 'app-core',
  // type: "json"
  type: 'pretty',
});
// testLogger.settings.minLevel = 2;
testLogger.settings.minLevel = 6;

export default testLogger as LoggerInterface | typeof testLogger;
