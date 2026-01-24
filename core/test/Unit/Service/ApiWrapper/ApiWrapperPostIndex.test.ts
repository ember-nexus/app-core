import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { PostIndexEndpoint } from '../../../../src/Endpoint/Element/index.js';
import { NodeWithOptionalId, validateUuidFromString } from '../../../../src/Type/Definition/index.js';

test('postIndex results in API call', async () => {
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      some: 'data',
    },
  };

  const postIndexEndpoint = mock<PostIndexEndpoint>();
  when(() => postIndexEndpoint.postIndex(element))
    .thenResolve({
      data: validateUuidFromString('d531cf62-0157-4264-b5c1-ca0f5095850c'),
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    postIndexEndpoint,
  });

  const response = await apiWrapper.postIndex(element);
  expect(response).toEqual('d531cf62-0157-4264-b5c1-ca0f5095850c');
});

test('postIndex to expose errors', async () => {
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      some: 'data',
    },
  };

  const postIndexEndpoint = mock<PostIndexEndpoint>();
  when(() => postIndexEndpoint.postIndex(element))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    postIndexEndpoint,
  });

  await expect(() => apiWrapper.postIndex(element)).rejects.toThrowError('some error');
});
