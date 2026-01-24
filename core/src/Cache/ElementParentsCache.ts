import { LRUCache } from 'lru-cache';

import { Cache } from './Cache.js';
import { CacheEntry } from './CacheEntry.js';
import { Collection, Uuid } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ElementParentsCache extends Cache<Collection> {
  static identifier: ServiceIdentifier = ServiceIdentifier.cacheElementParents;

  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<Collection>>({
      max: 50,
    });
  }

  static constructFromServiceResolver(): ElementParentsCache {
    return new ElementParentsCache();
  }

  static createCacheKey(childId: Uuid, page: number, pageSize: number): string {
    return `${childId}-${page}-${pageSize}`;
  }
}

export { ElementParentsCache };
