import { ILogObj, Logger as TsLogger } from 'tslog';

import { LoggerInterface } from '../Type/Definition/index.js';

class Logger implements LoggerInterface {
  private logger: TsLogger<ILogObj>;
  constructor(logger: TsLogger<ILogObj>) {
    this.logger = logger;
  }

  debug(...args: unknown[]): unknown | undefined {
    return this.logger.debug(args);
  }

  error(...args: unknown[]): unknown | undefined {
    return this.logger.error(args);
  }

  info(...args: unknown[]): unknown | undefined {
    return this.logger.info(args);
  }

  warn(...args: unknown[]): unknown | undefined {
    return this.logger.warn(args);
  }
}

export { Logger };
