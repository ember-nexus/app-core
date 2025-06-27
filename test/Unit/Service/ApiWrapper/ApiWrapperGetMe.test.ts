import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { ElementCache } from '../../../../src/Cache/index.js';
import { GetMeEndpoint } from '../../../../src/Endpoint/User/index.js';

test('getMe with no cache results in API call', async () => {
  const element = {
    id: '650c5c96-c8bd-4802-81a7-d2d3f24905c1',
    type: 'User',
    data: {},
  };

  const headers = new Headers();
  headers.set('ETag', 'some-etag');
  const getMeEndpoint = mock<GetMeEndpoint>();
  when(() => getMeEndpoint.getMe())
    .thenResolve({
      data: element,
      response: new Response('', { headers: headers }),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getMeEndpoint,
  });

  const response = await apiWrapper.getMe();
  expect(response).toEqual(element);
});

test('getMe to expose errors', async () => {
  const getMeEndpoint = mock<GetMeEndpoint>();
  when(() => getMeEndpoint.getMe())
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    getMeEndpoint,
  });

  await expect(() => apiWrapper.getMe()).rejects.toThrowError('some error');
});
