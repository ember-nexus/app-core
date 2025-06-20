import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from '../../../../src/Cache';
import {
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
} from '../../../../src/Endpoint/Element';
import { ApiWrapper } from '../../../../src/Service';

function createApiWrapper(services: {
  getElementEndpoint?: GetElementEndpoint;
  getElementChildrenEndpoint?: GetElementChildrenEndpoint;
  getElementParentsEndpoint?: GetElementParentsEndpoint;
  getElementRelatedEndpoint?: GetElementRelatedEndpoint;
  getIndexEndpoint?: GetIndexEndpoint;
  elementCache?: ElementCache;
  elementChildrenCache?: ElementChildrenCache;
  elementParentsCache?: ElementParentsCache;
  elementRelatedCache?: ElementRelatedCache;
  indexCache?: IndexCache;
}): ApiWrapper {
  if (services.getElementEndpoint === undefined) services.getElementEndpoint = mock<GetElementEndpoint>();
  if (services.getElementChildrenEndpoint === undefined)
    services.getElementChildrenEndpoint = mock<GetElementChildrenEndpoint>();
  if (services.getElementParentsEndpoint === undefined)
    services.getElementParentsEndpoint = mock<GetElementParentsEndpoint>();
  if (services.getElementRelatedEndpoint === undefined)
    services.getElementRelatedEndpoint = mock<GetElementRelatedEndpoint>();
  if (services.getIndexEndpoint === undefined) services.getIndexEndpoint = mock<GetIndexEndpoint>();
  if (services.elementCache === undefined) services.elementCache = mock<ElementCache>();
  if (services.elementChildrenCache === undefined) services.elementChildrenCache = mock<ElementChildrenCache>();
  if (services.elementParentsCache === undefined) services.elementParentsCache = mock<ElementParentsCache>();
  if (services.elementRelatedCache === undefined) services.elementRelatedCache = mock<ElementRelatedCache>();
  if (services.indexCache === undefined) services.indexCache = mock<IndexCache>();

  return new ApiWrapper(
    services.getElementEndpoint,
    services.getElementChildrenEndpoint,
    services.getElementParentsEndpoint,
    services.getElementRelatedEndpoint,
    services.getIndexEndpoint,
    services.elementCache,
    services.elementChildrenCache,
    services.elementParentsCache,
    services.elementRelatedCache,
    services.indexCache,
  );
}

test('getElement with no cache results in API call', async () => {
  const element = {
    id: '650c5c96-c8bd-4802-81a7-d2d3f24905c1',
    type: 'Data',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getElementEndpoint = mock<GetElementEndpoint>();
  when(() => getElementEndpoint.getElement('650c5c96-c8bd-4802-81a7-d2d3f24905c1')).thenReturn(
    Promise.resolve({
      data: element,
      response: new Response('', { headers: headers }),
    }),
  );

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
  when(() => getElementEndpoint.getElement('93405a01-8dbb-44f9-9b31-e1991a15cedc', 'some-etag')).thenReturn(
    Promise.resolve({
      response: new Response(null, { status: 304, headers: headers }),
    }),
  );

  const elementCache = new ElementCache();
  elementCache.setFromDataEtag('93405a01-8dbb-44f9-9b31-e1991a15cedc', element, 'some-etag');

  const apiWrapper = createApiWrapper({
    elementCache,
    getElementEndpoint,
  });

  const response = await apiWrapper.getElement('93405a01-8dbb-44f9-9b31-e1991a15cedc', true);
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
  when(() => getElementEndpoint.getElement('910774f3-03e7-47a7-b062-f6ea9945c39d', 'outdated-etag')).thenReturn(
    Promise.resolve({
      data: element,
      response: new Response('', { headers: headers }),
    }),
  );

  const elementCache = new ElementCache();
  elementCache.setFromDataEtag('910774f3-03e7-47a7-b062-f6ea9945c39d', element, 'outdated-etag');

  const apiWrapper = createApiWrapper({
    elementCache,
    getElementEndpoint,
  });

  expect(elementCache.get('910774f3-03e7-47a7-b062-f6ea9945c39d')?.etag).toEqual('outdated-etag');
  const response = await apiWrapper.getElement('910774f3-03e7-47a7-b062-f6ea9945c39d', true);
  expect(response).toEqual(element);
  expect(elementCache.get('910774f3-03e7-47a7-b062-f6ea9945c39d')?.etag).toEqual('new-etag');
});
