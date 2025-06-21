import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { PostTokenEndpoint } from '../../../../src/Endpoint/User';
import { createUniqueUserIdentifierFromString, validateTokenFromString } from '../../../../src/Type/Definition';

test('postToken results in API call', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const password = 'password';

  const token = validateTokenFromString('secret-token:randomChars');

  const postTokenEndpoint = mock<PostTokenEndpoint>();
  when(() => postTokenEndpoint.postToken(userIdentifier, password))
    .thenResolve({
      data: token,
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    postTokenEndpoint,
  });

  const response = await apiWrapper.postToken(userIdentifier, password);
  expect(response).toEqual(token);
});

test('postToken to expose errors', async () => {
  const userIdentifier = createUniqueUserIdentifierFromString('email@localhost.dev');
  const password = 'password';

  const postTokenEndpoint = mock<PostTokenEndpoint>();
  when(() => postTokenEndpoint.postToken(userIdentifier, password))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    postTokenEndpoint,
  });

  await expect(() => apiWrapper.postToken(userIdentifier, password)).rejects.toThrowError('some error');
});
