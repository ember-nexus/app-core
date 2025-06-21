import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache, ElementParentsCache } from '../../../../src/Cache';
import { GetElementParentsEndpoint } from '../../../../src/Endpoint/Element';

test('getElementParents with no cache results in API call', async () => {
  const collection = {
    id: '/6f78868d-dd4c-4796-997f-7d0b44cb87bd/parents?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/6f78868d-dd4c-4796-997f-7d0b44cb87bd/parents?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/6f78868d-dd4c-4796-997f-7d0b44cb87bd/parents?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '1559eac8-60af-492e-a988-39035167fb5a',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: 'ca6b1749-fb0e-470a-838c-098f0e3061a4',
        data: {},
        start: '7257855f-4ec0-4176-895d-73f723b2bd17',
        end: '4bbf22ba-b5b8-4e3d-a29f-3e285bb94f2a',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementParentsEndpoint = mock<GetElementParentsEndpoint>();
  when(() => getElementParentsEndpoint.getElementParents('6f78868d-dd4c-4796-997f-7d0b44cb87bd', 1, 25))
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementParentsCache: new ElementParentsCache(),
    getElementParentsEndpoint,
  });

  const response = await apiWrapper.getElementParents('6f78868d-dd4c-4796-997f-7d0b44cb87bd');
  expect(response).toEqual(collection);
});

test('getElementParents with cache results in no API call', async () => {
  const collection = {
    id: '/28c68052-8fd4-4aa3-8063-c1b24ba3206b/parents?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/28c68052-8fd4-4aa3-8063-c1b24ba3206b/parents?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/28c68052-8fd4-4aa3-8063-c1b24ba3206b/parents?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: 'e58a0824-e7b8-41d5-95e9-a7ca28d598c8',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '36f8dba9-0e6e-428d-8346-51cfc7dbd4ed',
        data: {},
        start: 'a9180f95-1087-4edd-b8e5-0192f9995c6b',
        end: 'a6b0dcb6-5299-47f7-a296-5936261c85bb',
      },
    ],
  };

  const elementParentsCache = new ElementParentsCache();
  elementParentsCache.setFromDataEtag('28c68052-8fd4-4aa3-8063-c1b24ba3206b-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementParentsCache,
  });

  const response = await apiWrapper.getElementParents('28c68052-8fd4-4aa3-8063-c1b24ba3206b');
  expect(response).toEqual(collection);
});

test('getElementParents with forceLoad and up to date cache results in refresh', async () => {
  const collection = {
    id: '/a020ed61-ce52-401f-8d4d-3f7b3f2dddb2/parents?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/a020ed61-ce52-401f-8d4d-3f7b3f2dddb2/parents?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/a020ed61-ce52-401f-8d4d-3f7b3f2dddb2/parents?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '3efee606-5e17-4132-8853-c3477873292c',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '9a76354e-d534-4c62-9e00-596892a4b9c4',
        data: {},
        start: '05c27d9e-9012-4db5-bcd4-403ff56b5551',
        end: '8f81162d-a943-4cb8-b160-a3aa1f026400',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementParentsEndpoint = mock<GetElementParentsEndpoint>();
  when(() => getElementParentsEndpoint.getElementParents('a020ed61-ce52-401f-8d4d-3f7b3f2dddb2', 1, 25, 'some-etag'))
    .thenResolve({
      response: new Response(null, { status: 304, headers: headers }),
    })
    .once();

  const elementParentsCache = new ElementParentsCache();
  elementParentsCache.setFromDataEtag('a020ed61-ce52-401f-8d4d-3f7b3f2dddb2-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementParentsCache,
    getElementParentsEndpoint,
  });

  const response = await apiWrapper.getElementParents('a020ed61-ce52-401f-8d4d-3f7b3f2dddb2', { forceLoad: true });
  expect(response).toEqual(collection);
});

test('getElementParents with forceLoad and outdated cache results in new API call', async () => {
  const collection = {
    id: '/97299077-9536-45f0-a34f-e6b6614cd9d7/parents?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/97299077-9536-45f0-a34f-e6b6614cd9d7/parents?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/97299077-9536-45f0-a34f-e6b6614cd9d7/parents?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '3beec225-634a-4c37-b2e3-2452c848b011',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: 'db7a8484-4d73-4382-8a05-36d03e24585d',
        data: {},
        start: '0beba97e-e4fe-40f3-9a94-561774edd58f',
        end: 'cf1857aa-dd60-4184-be0b-cb4f584e0ec6',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'new-etag');
  const getElementParentsEndpoint = mock<GetElementParentsEndpoint>();
  when(() =>
    getElementParentsEndpoint.getElementParents('97299077-9536-45f0-a34f-e6b6614cd9d7', 1, 25, 'outdated-etag'),
  )
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const elementParentsCache = new ElementParentsCache();
  elementParentsCache.setFromDataEtag('97299077-9536-45f0-a34f-e6b6614cd9d7-1-25', collection, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementParentsCache,
    getElementParentsEndpoint,
  });

  expect(elementParentsCache.get('97299077-9536-45f0-a34f-e6b6614cd9d7-1-25')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getElementParents('97299077-9536-45f0-a34f-e6b6614cd9d7', { forceLoad: true });
  expect(response).toEqual(collection);
  expect(elementParentsCache.get('97299077-9536-45f0-a34f-e6b6614cd9d7-1-25')?.etag).toEqual('new-etag');
});
