import { LRUCache } from 'lru-cache';

import { CacheEntry } from './CacheEntry.js';
import { LogicError } from '../Error/index.js';
import { ParsedResponse } from '../Type/Definition/Response/index.js';

abstract class Cache<T> {
  protected cache: LRUCache<string, CacheEntry<T>>;

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public get(key: string): CacheEntry<T> | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: CacheEntry<T>): this {
    this.cache.set(key, value);
    return this;
  }

  public delete(key: string): this {
    this.cache.delete(key);
    return this;
  }

  /**
   * Sets a cache entry with the given data and optional ETag.
   * If no ETag is provided, reuses the previous one if available.
   *
   * Reusing a known ETag can improve API performance when the data
   * is unchanged but the new source lacks ETag metadata.
   */
  public setFromDataEtag(key: string, data: T, etag?: string | undefined): this {
    const previousCacheEntry = this.cache.get(key);
    if (previousCacheEntry && etag === undefined) {
      etag = previousCacheEntry.etag;
    }
    const cacheEntry = {
      data: data,
      etag: etag,
    };
    this.cache.set(key, cacheEntry);
    return this;
  }

  public setFromParsedResponse(key: string, parsedResponse: ParsedResponse<T>): this {
    const etag = parsedResponse.response.headers.get('ETag');
    if (etag === null) {
      throw new LogicError('Expected parsedResponse to contain ETag header.');
    }
    const cacheEntry = {
      data: parsedResponse.data,
      etag: etag,
    };
    this.cache.set(key, cacheEntry);
    return this;
  }

  public refresh(key: string): this {
    console.log(key);
    return this;
  }
}

export { Cache };
