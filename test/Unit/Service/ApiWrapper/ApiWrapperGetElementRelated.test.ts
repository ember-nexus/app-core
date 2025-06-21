import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache, ElementRelatedCache } from '../../../../src/Cache';
import { GetElementRelatedEndpoint } from '../../../../src/Endpoint/Element';

test('getElementRelated with no cache results in API call', async () => {
  const collection = {
    id: '/405260d6-4d96-446e-ae17-f04538980fac/related?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/405260d6-4d96-446e-ae17-f04538980fac/related?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/405260d6-4d96-446e-ae17-f04538980fac/related?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '894555d8-039c-4518-bf2d-315d43fb75c7',
        data: {},
      },
    ],
    relations: [
      {
        type: 'RELATION',
        id: '6c94a3ff-7898-4385-81b3-143125bcf340',
        data: {},
        start: '38c1e94b-e0a7-4908-9b31-cc476fdcca29',
        end: 'dfa03fc3-228d-45ba-a3ac-10e65b8d251c',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementRelatedEndpoint = mock<GetElementRelatedEndpoint>();
  when(() => getElementRelatedEndpoint.getElementRelated('405260d6-4d96-446e-ae17-f04538980fac', 1, 25))
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementRelatedCache: new ElementRelatedCache(),
    getElementRelatedEndpoint,
  });

  const response = await apiWrapper.getElementRelated('405260d6-4d96-446e-ae17-f04538980fac');
  expect(response).toEqual(collection);
});

test('getElementRelated with cache results in no API call', async () => {
  const collection = {
    id: '/dd05be13-ef5f-4ede-8f27-f453c1acb1e4/related?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/dd05be13-ef5f-4ede-8f27-f453c1acb1e4/related?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/dd05be13-ef5f-4ede-8f27-f453c1acb1e4/related?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '50abbe00-4c59-40e1-912f-b2905f55b63a',
        data: {},
      },
    ],
    relations: [
      {
        type: 'RELATION',
        id: '4210c079-72b5-4e86-bc9e-920028af9fd1',
        data: {},
        start: 'd18e6e7e-b331-433a-9e75-d612968c8361',
        end: '563e9448-9f13-471c-98b4-2e18de33b129',
      },
    ],
  };

  const elementRelatedCache = new ElementRelatedCache();
  elementRelatedCache.setFromDataEtag('dd05be13-ef5f-4ede-8f27-f453c1acb1e4-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementRelatedCache,
  });

  const response = await apiWrapper.getElementRelated('dd05be13-ef5f-4ede-8f27-f453c1acb1e4');
  expect(response).toEqual(collection);
});

test('getElementRelated with forceLoad and up to date cache results in refresh', async () => {
  const collection = {
    id: '/3d7f528f-ca83-4b97-808f-4a72f3b51316/related?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/3d7f528f-ca83-4b97-808f-4a72f3b51316/related?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/3d7f528f-ca83-4b97-808f-4a72f3b51316/related?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '89640f34-ea47-48d4-a30d-28b91ca64449',
        data: {},
      },
    ],
    relations: [
      {
        type: 'RELATION',
        id: '9d199623-d0d8-4444-bcd1-cc822b7587aa',
        data: {},
        start: '89299733-32ce-4caf-af5a-92e640537259',
        end: '96fdc1f2-c523-4071-94d2-7f54c689287d',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementRelatedEndpoint = mock<GetElementRelatedEndpoint>();
  when(() => getElementRelatedEndpoint.getElementRelated('3d7f528f-ca83-4b97-808f-4a72f3b51316', 1, 25, 'some-etag'))
    .thenResolve({
      response: new Response(null, { status: 304, headers: headers }),
    })
    .once();

  const elementRelatedCache = new ElementRelatedCache();
  elementRelatedCache.setFromDataEtag('3d7f528f-ca83-4b97-808f-4a72f3b51316-1-25', collection, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementRelatedCache,
    getElementRelatedEndpoint,
  });

  const response = await apiWrapper.getElementRelated('3d7f528f-ca83-4b97-808f-4a72f3b51316', { forceLoad: true });
  expect(response).toEqual(collection);
});

test('getElementRelated with forceLoad and outdated cache results in new API call', async () => {
  const collection = {
    id: '/b87c3bfd-0321-46a6-845a-48a69eac2c53/related?page=1?pageSize=25',
    totalNodes: 1,
    links: {
      first: '/b87c3bfd-0321-46a6-845a-48a69eac2c53/related?page=1?pageSize=25',
      previous: null,
      next: null,
      last: '/b87c3bfd-0321-46a6-845a-48a69eac2c53/related?page=1?pageSize=25',
    },
    nodes: [
      {
        type: 'Data',
        id: '57878314-226c-40c5-9ddf-2dcb0e12262d',
        data: {},
      },
    ],
    relations: [
      {
        type: 'RELATION',
        id: '637fa821-a058-4153-9000-799f394e8b44',
        data: {},
        start: 'ae5acd23-9744-496b-a6c5-5f04401fa279',
        end: '7eac63eb-44b8-4332-8f9e-46889ee93feb',
      },
    ],
  };

  const headers = new Headers();
  headers.set('ETag', 'new-etag');
  const getElementRelatedEndpoint = mock<GetElementRelatedEndpoint>();
  when(() =>
    getElementRelatedEndpoint.getElementRelated('b87c3bfd-0321-46a6-845a-48a69eac2c53', 1, 25, 'outdated-etag'),
  )
    .thenResolve({
      data: collection,
      response: new Response('', { headers: headers }),
    })
    .once();

  const elementRelatedCache = new ElementRelatedCache();
  elementRelatedCache.setFromDataEtag('b87c3bfd-0321-46a6-845a-48a69eac2c53-1-25', collection, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    elementRelatedCache,
    getElementRelatedEndpoint,
  });

  expect(elementRelatedCache.get('b87c3bfd-0321-46a6-845a-48a69eac2c53-1-25')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getElementRelated('b87c3bfd-0321-46a6-845a-48a69eac2c53', { forceLoad: true });
  expect(response).toEqual(collection);
  expect(elementRelatedCache.get('b87c3bfd-0321-46a6-845a-48a69eac2c53-1-25')?.etag).toEqual('new-etag');
});

test('getElementRelated to expose errors', async () => {
  const getElementRelatedEndpoint = mock<GetElementRelatedEndpoint>();
  when(() => getElementRelatedEndpoint.getElementRelated('fbe56b00-2cb0-40e3-bac0-fabe3f8fe250', 1, 25))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementRelatedCache: new ElementRelatedCache(),
    getElementRelatedEndpoint,
  });

  await expect(() => apiWrapper.getElementRelated('fbe56b00-2cb0-40e3-bac0-fabe3f8fe250')).rejects.toThrowError(
    'some error',
  );
});
