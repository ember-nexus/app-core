import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { PostChangePasswordEndpoint } from '../../../../src/Endpoint/User/index.js';
import { createUniqueUserIdentifierFromString } from '../../../../src/Type/Definition/index.js';

test('postChangePassword results in API call', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const currentPassword = 'current-password';
  const newPassword = 'new-password';

  const postChangePasswordEndpoint = mock<PostChangePasswordEndpoint>();
  when(() => postChangePasswordEndpoint.postChangePassword(userIdentifier, currentPassword, newPassword))
    .thenResolve({
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    postChangePasswordEndpoint,
  });

  const response = await apiWrapper.postChangePassword(userIdentifier, currentPassword, newPassword);
  expect(response).toBeUndefined();
});

test('postChangePassword to expose errors', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const currentPassword = 'current-password';
  const newPassword = 'new-password';

  const postChangePasswordEndpoint = mock<PostChangePasswordEndpoint>();
  when(() => postChangePasswordEndpoint.postChangePassword(userIdentifier, currentPassword, newPassword))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    postChangePasswordEndpoint,
  });

  await expect(() => apiWrapper.postChangePassword(userIdentifier, currentPassword, newPassword)).rejects.toThrowError(
    'some error',
  );
});
