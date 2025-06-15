import { LRUCache } from 'lru-cache';

import { Cache } from './Cache.js';
import { CacheEntry } from './CacheEntry.js';
import { Collection, Uuid } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ElementChildrenCache extends Cache<Collection> {
  static identifier: ServiceIdentifier = ServiceIdentifier.cacheElementChildren;

  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<Collection>>({
      max: 50,
    });
  }

  static constructFromServiceResolver(): ElementChildrenCache {
    return new ElementChildrenCache();
  }

  static createCacheKey(parentId: Uuid, page: number, pageSize: number): string {
    return `${parentId}-${page}-${pageSize}`;
  }
}

export { ElementChildrenCache };
