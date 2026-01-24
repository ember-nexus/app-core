import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { ElementCache } from '../../../../src/Cache/index.js';
import { GetTokenEndpoint } from '../../../../src/Endpoint/User/index.js';

test('getToken with no cache results in API call', async () => {
  const element = {
    id: '650c5c96-c8bd-4802-81a7-d2d3f24905c1',
    type: 'Token',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getTokenEndpoint = mock<GetTokenEndpoint>();
  when(() => getTokenEndpoint.getToken())
    .thenResolve({
      data: element,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getTokenEndpoint,
  });

  const response = await apiWrapper.getToken();
  expect(response).toEqual(element);
});

test('getToken to expose errors', async () => {
  const getTokenEndpoint = mock<GetTokenEndpoint>();
  when(() => getTokenEndpoint.getToken())
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getTokenEndpoint,
  });

  await expect(() => apiWrapper.getToken()).rejects.toThrowError('some error');
});
