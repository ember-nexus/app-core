import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache } from '../../../../src/Cache';
import { GetElementEndpoint } from '../../../../src/Endpoint/Element';

test('getElement with no cache results in API call', async () => {
  const element = {
    id: '650c5c96-c8bd-4802-81a7-d2d3f24905c1',
    type: 'Data',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementEndpoint = mock<GetElementEndpoint>();
  when(() => getElementEndpoint.getElement('650c5c96-c8bd-4802-81a7-d2d3f24905c1'))
    .thenResolve({
      data: element,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getElementEndpoint,
  });

  const response = await apiWrapper.getElement('650c5c96-c8bd-4802-81a7-d2d3f24905c1');
  expect(response).toEqual(element);
});

test('getElement with cache results in no API call', async () => {
  const element = {
    id: '8dce8a2e-169d-4657-9704-95011caba3d0',
    type: 'Data',
    data: {},
  };

  const elementCache = new ElementCache();
  elementCache.setFromDataEtag('8dce8a2e-169d-4657-9704-95011caba3d0', element, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementCache,
  });

  const response = await apiWrapper.getElement('8dce8a2e-169d-4657-9704-95011caba3d0');
  expect(response).toEqual(element);
});

test('getElement with forceLoad and up to date cache results in refresh', async () => {
  const element = {
    id: '93405a01-8dbb-44f9-9b31-e1991a15cedc',
    type: 'Data',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementEndpoint = mock<GetElementEndpoint>();
  when(() => getElementEndpoint.getElement('93405a01-8dbb-44f9-9b31-e1991a15cedc', 'some-etag'))
    .thenResolve({
      response: new Response(null, { status: 304, headers: headers }),
    })
    .once();

  const elementCache = new ElementCache();
  elementCache.setFromDataEtag('93405a01-8dbb-44f9-9b31-e1991a15cedc', element, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementCache,
    getElementEndpoint,
  });

  const response = await apiWrapper.getElement('93405a01-8dbb-44f9-9b31-e1991a15cedc', { forceLoad: true });
  expect(response).toEqual(element);
});

test('getElement with forceLoad and outdated cache results in new API call', async () => {
  const element = {
    id: '910774f3-03e7-47a7-b062-f6ea9945c39d',
    type: 'Data',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'new-etag');
  const getElementEndpoint = mock<GetElementEndpoint>();
  when(() => getElementEndpoint.getElement('910774f3-03e7-47a7-b062-f6ea9945c39d', 'outdated-etag'))
    .thenResolve({
      data: element,
      response: new Response('', { headers: headers }),
    })
    .once();

  const elementCache = new ElementCache();
  elementCache.setFromDataEtag('910774f3-03e7-47a7-b062-f6ea9945c39d', element, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache,
    getElementEndpoint,
  });

  expect(elementCache.get('910774f3-03e7-47a7-b062-f6ea9945c39d')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getElement('910774f3-03e7-47a7-b062-f6ea9945c39d', { forceLoad: true });
  expect(response).toEqual(element);
  expect(elementCache.get('910774f3-03e7-47a7-b062-f6ea9945c39d')?.etag).toEqual('new-etag');
});

test('getElement to expose errors', async () => {
  const getElementEndpoint = mock<GetElementEndpoint>();
  when(() => getElementEndpoint.getElement('9fb2ca19-3ef7-493e-8674-7caa9650dfa7'))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getElementEndpoint,
  });

  await expect(() => apiWrapper.getElement('9fb2ca19-3ef7-493e-8674-7caa9650dfa7')).rejects.toThrowError('some error');
});
