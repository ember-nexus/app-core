import { LRUCache } from 'lru-cache';
import { expect, test } from 'vitest';

import { Cache, CacheEntry } from '../../../src/Cache';

class TestCache extends Cache<string> {
  constructor() {
    super();
    this.cache = new LRUCache<string, CacheEntry<string>>({
      max: 10,
    });
  }
}

test('Cache does not contain entries by default', () => {
  const cache = new TestCache();

  expect(cache.has('unknown-key')).toEqual(false);
  expect(cache.get('unknown-key')).toEqual(undefined);
  expect(cache.delete('unknown-key')).toEqual(cache);
});

test('Cache entries can be set, returned and deleted', () => {
  const cache = new TestCache();

  const entry = {
    data: 'value',
    etag: 'etag',
  };

  cache.set('key', entry);

  expect(cache.has('key')).toEqual(true);
  expect(cache.get('key')).toEqual(entry);

  cache.delete('key');

  expect(cache.has('key')).toEqual(false);
  expect(cache.get('key')).toEqual(undefined);
});

test('setFromDataEtag sets data correctly with etag provided', () => {
  const cache = new TestCache();

  const entry = {
    data: 'value',
    etag: 'etag',
  };

  const response = cache.setFromDataEtag('key', entry.data, entry.etag);
  expect(response).toEqual(cache);

  expect(cache.has('key')).toEqual(true);
  expect(cache.get('key')).toEqual(entry);
});

test('setFromDataEtag sets data correctly without etag provided', () => {
  const cache = new TestCache();

  const entry = {
    data: 'value',
    etag: undefined,
  };

  const response = cache.setFromDataEtag('key', entry.data);
  expect(response).toEqual(cache);

  expect(cache.has('key')).toEqual(true);
  expect(cache.get('key')).toEqual(entry);
});

test('setFromDataEtag sets data correctly without etag provided and previous etag', () => {
  const cache = new TestCache();

  cache.setFromDataEtag('key', 'previous data', 'some-previous-etag');

  const entry = {
    data: 'value',
    etag: undefined,
  };

  const response = cache.setFromDataEtag('key', entry.data);
  expect(response).toEqual(cache);

  expect(cache.has('key')).toEqual(true);
  expect(cache.get('key')).toEqual({
    data: 'value',
    etag: 'some-previous-etag',
  });
});

test('setFromParsedResponse sets data correctly when etag header is present', () => {
  const cache = new TestCache();

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const parsedResponse = {
    response: new Response('', {
      headers: headers,
    }),
    data: 'value',
  };

  const response = cache.setFromParsedResponse('key', parsedResponse);
  expect(response).toEqual(cache);

  expect(cache.has('key')).toEqual(true);
  expect(cache.get('key')).toEqual({
    data: 'value',
    etag: 'some-etag',
  });
});

test('setFromParsedResponse throws error when etag header is absent', () => {
  const cache = new TestCache();

  const parsedResponse = {
    response: new Response('', {
      headers: new Headers(),
    }),
    data: 'value',
  };

  expect(() => cache.setFromParsedResponse('key', parsedResponse)).toThrowError(
    'Expected parsedResponse to contain ETag header.',
  );
});

/**
 * @todo implement refresh logic test later on
 */
test('refresh does return itself', () => {
  const cache = new TestCache();

  expect(cache.refresh('key')).toEqual(cache);
});
