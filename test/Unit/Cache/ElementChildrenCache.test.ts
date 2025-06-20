import { expect, test } from 'vitest';

import { ElementChildrenCache } from '../../../src/Cache';

test('service identifier', () => {
  expect(ElementChildrenCache.identifier).toEqual('ember-nexus.app-core.cache.element-children-cache');
});

test('createCacheKey creates unique cache keys', () => {
  expect(ElementChildrenCache.createCacheKey('00000000-0000-4000-8000-000000000000', 1, 1)).toEqual(
    '00000000-0000-4000-8000-000000000000-1-1',
  );
  expect(ElementChildrenCache.createCacheKey('fd3b33ae-4cf6-44c8-b973-5ac9a6c39dbd', 2, 3)).toEqual(
    'fd3b33ae-4cf6-44c8-b973-5ac9a6c39dbd-2-3',
  );
});
