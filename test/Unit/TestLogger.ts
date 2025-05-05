import { Logger } from 'tslog';

import type { LoggerInterface } from '../../src/Type/Definition';

const testLogger = new Logger({
  name: 'app-core',
  type: 'pretty',
});
// testLogger.settings.minLevel = 2;
testLogger.settings.minLevel = 6;

const typedLogger: LoggerInterface | typeof testLogger = testLogger;

export { typedLogger as testLogger };
