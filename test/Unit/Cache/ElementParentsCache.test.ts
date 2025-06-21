import { expect, test } from 'vitest';

import { ElementParentsCache } from '../../../src/Cache';

test('ElementParentsCache provides correct service identifier', () => {
  expect(ElementParentsCache.identifier).toEqual('ember-nexus.app-core.cache.element-parents-cache');
});

test('createCacheKey creates unique cache keys', () => {
  expect(ElementParentsCache.createCacheKey('00000000-0000-4000-8000-000000000000', 1, 1)).toEqual(
    '00000000-0000-4000-8000-000000000000-1-1',
  );
  expect(ElementParentsCache.createCacheKey('6185ecb0-496e-4834-a2ad-5775b95dd617', 2, 3)).toEqual(
    '6185ecb0-496e-4834-a2ad-5775b95dd617-2-3',
  );
});
