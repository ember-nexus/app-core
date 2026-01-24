import { Logger } from './Logger.js';
import { ServiceResolver } from './ServiceResolver.js';
import { Token } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

/**
 * Configuration handler.
 */
class ApiConfiguration {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceApiConfiguration;

  private token: Token | null;
  private apiHost: string;
  private elementCacheMaxEntries: number;
  private collectionCacheMaxEntries: number;
  private collectionPageSize: number;

  constructor(private logger: Logger) {
    this.token = null;
    this.apiHost = '';
    this.elementCacheMaxEntries = 100;
    this.collectionCacheMaxEntries = 50;
    this.collectionPageSize = 25;
  }

  static constructFromServiceResolver(serviceResolver: ServiceResolver): ApiConfiguration {
    const logger = serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger);
    return new ApiConfiguration(logger);
  }

  hasToken(): boolean {
    return this.token !== null;
  }

  getToken(): Token | null {
    return this.token;
  }

  setToken(token: Token | null): ApiConfiguration {
    this.token = token;
    return this;
  }

  getApiHost(): string {
    return this.apiHost;
  }

  setApiHost(apiHost: string): ApiConfiguration {
    if (apiHost.endsWith('/')) {
      this.logger.warn(
        'Removed trailing slash from API host configuration due to internal requirement. Please check if trailing slash can be directly removed.',
      );
      apiHost = apiHost.replace(/\/+$/, '');
    }
    this.apiHost = apiHost;
    return this;
  }

  getElementCacheMaxEntries(): number {
    return this.elementCacheMaxEntries;
  }

  setElementCacheMaxEntries(value: number): ApiConfiguration {
    this.elementCacheMaxEntries = value;
    return this;
  }

  getCollectionCacheMaxEntries(): number {
    return this.collectionCacheMaxEntries;
  }

  setCollectionCacheMaxEntries(value: number): ApiConfiguration {
    this.collectionCacheMaxEntries = value;
    return this;
  }

  getCollectionPageSize(): number {
    return this.collectionPageSize;
  }

  setCollectionPageSize(value: number): ApiConfiguration {
    this.collectionPageSize = value;
    return this;
  }
}

export { ApiConfiguration };
