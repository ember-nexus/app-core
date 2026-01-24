import { LRUCache } from 'lru-cache';

import { Cache } from './Cache.js';
import { CacheEntry } from './CacheEntry.js';
import { Collection, Uuid } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ElementRelatedCache extends Cache<Collection> {
  static identifier: ServiceIdentifier = ServiceIdentifier.cacheElementRelated;

  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<Collection>>({
      max: 50,
    });
  }

  static constructFromServiceResolver(): ElementRelatedCache {
    return new ElementRelatedCache();
  }

  static createCacheKey(centerId: Uuid, page: number, pageSize: number): string {
    return `${centerId}-${page}-${pageSize}`;
  }
}

export { ElementRelatedCache };
