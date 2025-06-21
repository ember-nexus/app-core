import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { PostRegisterEndpoint } from '../../../../src/Endpoint/User';
import { createUniqueUserIdentifierFromString, validateUuidFromString } from '../../../../src/Type/Definition';

test('postRegister results in API call', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const password = 'password';
  const data = {
    some: 'data',
  };

  const postRegisterEndpoint = mock<PostRegisterEndpoint>();
  when(() => postRegisterEndpoint.postRegister(userIdentifier, password, data))
    .thenResolve({
      data: validateUuidFromString('62d02d9b-0d29-45fb-b417-0ce989bcaf41'),
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    postRegisterEndpoint,
  });

  const response = await apiWrapper.postRegister(userIdentifier, password, data);
  expect(response).toEqual('62d02d9b-0d29-45fb-b417-0ce989bcaf41');
});

test('postRegister to expose errors', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const password = 'password';
  const data = {
    some: 'data',
  };

  const postRegisterEndpoint = mock<PostRegisterEndpoint>();
  when(() => postRegisterEndpoint.postRegister(userIdentifier, password, data))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    postRegisterEndpoint,
  });

  await expect(() => apiWrapper.postRegister(userIdentifier, password, data)).rejects.toThrowError('some error');
});
