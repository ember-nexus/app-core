import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { ElementCache, IndexCache } from '../../../../src/Cache/index.js';
import { GetIndexEndpoint } from '../../../../src/Endpoint/Element/index.js';

test('getIndex with no cache results in API call', async () => {
  const collection = {
    id: '/?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '894555d8-039c-4518-bf2d-315d43fb75c7',
        data: {},
      },
    ],
    relations: [],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getIndexEndpoint = mock<GetIndexEndpoint>();
  when(() => getIndexEndpoint.getIndex(1, 25))
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    indexCache: new IndexCache(),
    getIndexEndpoint,
  });

  const response = await apiWrapper.getIndex();
  expect(response).toEqual(collection);
});

test('getIndex with cache results in no API call', async () => {
  const collection = {
    id: '/?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '50abbe00-4c59-40e1-912f-b2905f55b63a',
        data: {},
      },
    ],
    relations: [],
  };

  const indexCache = new IndexCache();
  indexCache.setFromDataEtag('1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    indexCache,
  });

  const response = await apiWrapper.getIndex();
  expect(response).toEqual(collection);
});

test('getIndex with forceLoad and up to date cache results in refresh', async () => {
  const collection = {
    id: '/?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '89640f34-ea47-48d4-a30d-28b91ca64449',
        data: {},
      },
    ],
    relations: [],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getIndexEndpoint = mock<GetIndexEndpoint>();
  when(() => getIndexEndpoint.getIndex(1, 25, 'some-etag'))
    .thenResolve({
      response: new Response(null, { status: 304, headers: headers }),
    })
    .once();

  const indexCache = new IndexCache();
  indexCache.setFromDataEtag('1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    indexCache,
    getIndexEndpoint,
  });

  const response = await apiWrapper.getIndex({ forceLoad: true });
  expect(response).toEqual(collection);
});

test('getIndex with forceLoad and outdated cache results in new API call', async () => {
  const collection = {
    id: '/?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '57878314-226c-40c5-9ddf-2dcb0e12262d',
        data: {},
      },
    ],
    relations: [],
  };

  const headers = new Headers();
  headers.set('ETag', 'new-etag');
  const getIndexEndpoint = mock<GetIndexEndpoint>();
  when(() => getIndexEndpoint.getIndex(1, 25, 'outdated-etag'))
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const indexCache = new IndexCache();
  indexCache.setFromDataEtag('1-25', collection, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    indexCache,
    getIndexEndpoint,
  });

  expect(indexCache.get('1-25')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getIndex({ forceLoad: true });
  expect(response).toEqual(collection);
  expect(indexCache.get('1-25')?.etag).toEqual('new-etag');
});

test('getIndex to expose errors', async () => {
  const getIndexEndpoint = mock<GetIndexEndpoint>();
  when(() => getIndexEndpoint.getIndex(1, 25))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    indexCache: new IndexCache(),
    getIndexEndpoint,
  });

  await expect(() => apiWrapper.getIndex()).rejects.toThrowError('some error');
});
