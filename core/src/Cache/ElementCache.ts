import { LRUCache } from 'lru-cache';

import { Cache } from './Cache.js';
import { CacheEntry } from './CacheEntry.js';
import { Collection, Node, Relation, Uuid } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ElementCache extends Cache<Node | Relation> {
  static identifier: ServiceIdentifier = ServiceIdentifier.cacheElement;

  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<Node | Relation>>({
      max: 500,
    });
  }

  static constructFromServiceResolver(): ElementCache {
    return new ElementCache();
  }

  static createCacheKey(elementId: Uuid): string {
    return `${elementId}`;
  }

  setFromCollection(collection: Collection): this {
    for (let i = 0; i < collection.nodes.length; i++) {
      this.setFromDataEtag(ElementCache.createCacheKey(collection.nodes[i].id), collection.nodes[i]);
    }
    for (let i = 0; i < collection.relations.length; i++) {
      this.setFromDataEtag(ElementCache.createCacheKey(collection.relations[i].id), collection.relations[i]);
    }
    return this;
  }
}

export { ElementCache };
