import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache, ElementChildrenCache } from '../../../../src/Cache';
import { GetElementChildrenEndpoint } from '../../../../src/Endpoint/Element';

test('getElementChildren with no cache results in API call', async () => {
  const collection = {
    id: '/8af48222-501b-4b5f-acd2-cc6e7d5df694/children?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/8af48222-501b-4b5f-acd2-cc6e7d5df694/children?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/8af48222-501b-4b5f-acd2-cc6e7d5df694/children?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '9d0d2ad2-66a6-4d28-a705-7946ca8d0037',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '8991c110-3d53-48b1-802d-52f6a4c6148e',
        data: {},
        start: 'a80af8c2-0433-46ba-bd2a-5264be5394fe',
        end: 'c95495ab-dada-4eda-8421-4bec1b799638',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementChildrenEndpoint = mock<GetElementChildrenEndpoint>();
  when(() => getElementChildrenEndpoint.getElementChildren('8af48222-501b-4b5f-acd2-cc6e7d5df694', 1, 25))
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementChildrenCache: new ElementChildrenCache(),
    getElementChildrenEndpoint,
  });

  const response = await apiWrapper.getElementChildren('8af48222-501b-4b5f-acd2-cc6e7d5df694');
  expect(response).toEqual(collection);
});

test('getElementChildren with cache results in no API call', async () => {
  const collection = {
    id: '/ac87b065-00f8-4d23-8245-8e9674b45c00/children?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/ac87b065-00f8-4d23-8245-8e9674b45c00/children?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/ac87b065-00f8-4d23-8245-8e9674b45c00/children?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: 'f99f7ca0-049e-467d-932d-a98e194a0e20',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '4cff611d-a6ee-4dab-bf30-c4cee5cc1e2c',
        data: {},
        start: 'b25c45c4-128b-4e45-bb8b-21921f91d59a',
        end: 'e6214d7a-d077-49fa-817a-a4a7ad236052',
      },
    ],
  };

  const elementChildrenCache = new ElementChildrenCache();
  elementChildrenCache.setFromDataEtag('ac87b065-00f8-4d23-8245-8e9674b45c00-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementChildrenCache,
  });

  const response = await apiWrapper.getElementChildren('ac87b065-00f8-4d23-8245-8e9674b45c00');
  expect(response).toEqual(collection);
});

test('getElementChildren with forceLoad and up to date cache results in refresh', async () => {
  const collection = {
    id: '/faabe232-9d4b-4885-aae1-1097286635cf/children?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/faabe232-9d4b-4885-aae1-1097286635cf/children?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/faabe232-9d4b-4885-aae1-1097286635cf/children?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '755956a8-b73d-43de-b8a3-d9a71e0f2a96',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '9a3e327e-2910-4a17-8c64-a70c4fd0021a',
        data: {},
        start: '8318a48f-bbf6-4b80-a7fa-2a9c0da5cb68',
        end: '181b461d-472b-44f8-a2e1-eab00d13c6bc',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementChildrenEndpoint = mock<GetElementChildrenEndpoint>();
  when(() => getElementChildrenEndpoint.getElementChildren('faabe232-9d4b-4885-aae1-1097286635cf', 1, 25, 'some-etag'))
    .thenResolve({
      response: new Response(null, { status: 304, headers: headers }),
    })
    .once();

  const elementChildrenCache = new ElementChildrenCache();
  elementChildrenCache.setFromDataEtag('faabe232-9d4b-4885-aae1-1097286635cf-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementChildrenCache,
    getElementChildrenEndpoint,
  });

  const response = await apiWrapper.getElementChildren('faabe232-9d4b-4885-aae1-1097286635cf', { forceLoad: true });
  expect(response).toEqual(collection);
});

test('getElementChildren with forceLoad and outdated cache results in new API call', async () => {
  const collection = {
    id: '/ef562bea-70df-4b23-8955-6e28e2de6e81/children?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/ef562bea-70df-4b23-8955-6e28e2de6e81/children?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/ef562bea-70df-4b23-8955-6e28e2de6e81/children?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '27d043c2-3333-4926-8a0b-ab2bdb40ea54',
        data: {},
      },
    ],
    relations: [
      {
        type: 'OWNS',
        id: '04055c68-d6de-40f9-90a0-79e5f252efbe',
        data: {},
        start: '2db64b2c-8d82-4121-aacd-2f7a9de62864',
        end: 'f0e3d294-4c21-45c0-bd7a-574ae9c14484',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'new-etag');
  const getElementChildrenEndpoint = mock<GetElementChildrenEndpoint>();
  when(() =>
    getElementChildrenEndpoint.getElementChildren('ef562bea-70df-4b23-8955-6e28e2de6e81', 1, 25, 'outdated-etag'),
  )
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const elementChildrenCache = new ElementChildrenCache();
  elementChildrenCache.setFromDataEtag('ef562bea-70df-4b23-8955-6e28e2de6e81-1-25', collection, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementChildrenCache,
    getElementChildrenEndpoint,
  });

  expect(elementChildrenCache.get('ef562bea-70df-4b23-8955-6e28e2de6e81-1-25')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getElementChildren('ef562bea-70df-4b23-8955-6e28e2de6e81', { forceLoad: true });
  expect(response).toEqual(collection);
  expect(elementChildrenCache.get('ef562bea-70df-4b23-8955-6e28e2de6e81-1-25')?.etag).toEqual('new-etag');
});

test('getElementChildren to expose errors', async () => {
  const getElementChildrenEndpoint = mock<GetElementChildrenEndpoint>();
  when(() => getElementChildrenEndpoint.getElementChildren('9fb2ca19-3ef7-493e-8674-7caa9650dfa7', 1, 25))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementChildrenCache: new ElementChildrenCache(),
    getElementChildrenEndpoint,
  });

  await expect(() => apiWrapper.getElementChildren('9fb2ca19-3ef7-493e-8674-7caa9650dfa7')).rejects.toThrowError(
    'some error',
  );
});
