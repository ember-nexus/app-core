import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache } from '../../../../src/Cache';
import { DeleteTokenEndpoint } from '../../../../src/Endpoint/User';

test('deleteToken results in API call', async () => {
  const deleteTokenEndpoint = mock<DeleteTokenEndpoint>();
  when(() => deleteTokenEndpoint.deleteToken())
    .thenResolve({
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    deleteTokenEndpoint,
  });

  const response = await apiWrapper.deleteToken();
  expect(response).toBeUndefined();
});

test('deleteToken to expose errors', async () => {
  const deleteTokenEndpoint = mock<DeleteTokenEndpoint>();
  when(() => deleteTokenEndpoint.deleteToken())
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    deleteTokenEndpoint,
  });

  await expect(() => apiWrapper.deleteToken()).rejects.toThrowError('some error');
});
