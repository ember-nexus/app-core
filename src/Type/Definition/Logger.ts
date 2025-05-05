import { ILogObj, Logger as TsLogger } from 'tslog';

interface LoggerInterface {
  debug(...args: unknown[]): unknown | undefined;
  info(...args: unknown[]): unknown | undefined;
  warn(...args: unknown[]): unknown | undefined;
  error(...args: unknown[]): unknown | undefined;
}

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

export { LoggerInterface, Logger };
