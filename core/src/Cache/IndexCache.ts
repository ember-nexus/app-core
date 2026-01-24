import { LRUCache } from 'lru-cache';

import { Cache } from './Cache.js';
import { CacheEntry } from './CacheEntry.js';
import { Collection } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class IndexCache extends Cache<Collection> {
  static identifier: ServiceIdentifier = ServiceIdentifier.cacheIndex;

  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<Collection>>({
      max: 50,
    });
  }

  static constructFromServiceResolver(): IndexCache {
    return new IndexCache();
  }

  static createCacheKey(page: number, pageSize: number): string {
    return `${page}-${pageSize}`;
  }
}

export { IndexCache };
