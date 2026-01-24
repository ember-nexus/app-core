import { expect, test } from 'vitest';

import { ElementCache } from '../../../src/Cache/index.js';
import { Collection } from '../../../src/Type/Definition/index.js';

test('ElementCache provides correct service identifier', () => {
  expect(ElementCache.identifier).toEqual('ember-nexus.app-core.cache.element-cache');
});

test('createCacheKey creates unique cache keys', () => {
  expect(ElementCache.createCacheKey('00000000-0000-4000-8000-000000000000')).toEqual(
    '00000000-0000-4000-8000-000000000000',
  );
  expect(ElementCache.createCacheKey('6185ecb0-496e-4834-a2ad-5775b95dd617')).toEqual(
    '6185ecb0-496e-4834-a2ad-5775b95dd617',
  );
});

test('setFromCollection iterates over nodes and relations', () => {
  const collection: Collection = {
    id: 'string',
    totalNodes: 123,
    links: {
      first: '/',
      previous: null,
      next: null,
      last: '/',
    },
    nodes: [
      {
        type: 'A',
        id: '00000000-0000-4000-8000-00000000000a',
        data: {},
      },
      {
        type: 'B',
        id: '00000000-0000-4000-8000-00000000000b',
        data: {},
      },
    ],
    relations: [
      {
        type: 'C',
        id: '00000000-0000-4000-8000-00000000000c',
        data: {},
        start: '00000000-0000-4000-8000-00000000001c',
        end: '00000000-0000-4000-8000-00000000002c',
      },
      {
        type: 'D',
        id: '00000000-0000-4000-8000-00000000000d',
        data: {},
        start: '00000000-0000-4000-8000-00000000001d',
        end: '00000000-0000-4000-8000-00000000002d',
      },
    ],
  };

  const elementCache = new ElementCache();

  const response = elementCache.setFromCollection(collection);
  expect(response).toEqual(elementCache);

  expect(elementCache.has('00000000-0000-4000-8000-00000000000a')).toBeTruthy();
  expect(elementCache.has('00000000-0000-4000-8000-00000000000b')).toBeTruthy();
  expect(elementCache.has('00000000-0000-4000-8000-00000000000c')).toBeTruthy();
  expect(elementCache.has('00000000-0000-4000-8000-00000000000d')).toBeTruthy();
});
