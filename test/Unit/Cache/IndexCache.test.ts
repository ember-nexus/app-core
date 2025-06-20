import { expect, test } from 'vitest';

import { IndexCache } from '../../../src/Cache';

test('service identifier', () => {
  expect(IndexCache.identifier).toEqual('ember-nexus.app-core.cache.index-cache');
});

test('createCacheKey creates unique cache keys', () => {
  expect(IndexCache.createCacheKey(1, 1)).toEqual('1-1');
  expect(IndexCache.createCacheKey(2, 3)).toEqual('2-3');
});
