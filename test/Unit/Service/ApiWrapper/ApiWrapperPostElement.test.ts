import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { PostElementEndpoint } from '../../../../src/Endpoint/Element';
import { NodeWithOptionalId, validateUuidFromString } from '../../../../src/Type/Definition';

test('postElement results in API call', async () => {
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      some: 'data',
    },
  };

  const postElementEndpoint = mock<PostElementEndpoint>();
  when(() => postElementEndpoint.postElement('b524701c-d0c3-43fd-bd46-368f4474183d', element))
    .thenResolve({
      data: validateUuidFromString('d2357ab7-9696-4fb4-aaae-7697c17f7e37'),
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    postElementEndpoint,
  });

  const response = await apiWrapper.postElement('b524701c-d0c3-43fd-bd46-368f4474183d', element);
  expect(response).toEqual('d2357ab7-9696-4fb4-aaae-7697c17f7e37');
});

test('postElement to expose errors', async () => {
  const element: NodeWithOptionalId = {
    type: 'Data',
    data: {
      some: 'data',
    },
  };

  const postElementEndpoint = mock<PostElementEndpoint>();
  when(() => postElementEndpoint.postElement('7ead61fd-4d6e-4f08-85d9-9f4670e9ec43', element))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    postElementEndpoint,
  });

  await expect(() => apiWrapper.postElement('7ead61fd-4d6e-4f08-85d9-9f4670e9ec43', element)).rejects.toThrowError(
    'some error',
  );
});
