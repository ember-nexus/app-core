import { expect, test } from 'vitest';

import { ElementRelatedCache } from '../../../src/Cache';

test('ElementRelatedCache provides correct service identifier', () => {
  expect(ElementRelatedCache.identifier).toEqual('ember-nexus.app-core.cache.element-related-cache');
});

test('createCacheKey creates unique cache keys', () => {
  expect(ElementRelatedCache.createCacheKey('00000000-0000-4000-8000-000000000000', 1, 1)).toEqual(
    '00000000-0000-4000-8000-000000000000-1-1',
  );
  expect(ElementRelatedCache.createCacheKey('296db34c-0d89-49cf-8d2d-e68979639fbb', 2, 3)).toEqual(
    '296db34c-0d89-49cf-8d2d-e68979639fbb-2-3',
  );
});
