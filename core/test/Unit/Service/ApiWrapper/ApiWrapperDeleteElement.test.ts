import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper.js';
import { ElementCache } from '../../../../src/Cache/index.js';
import { DeleteElementEndpoint } from '../../../../src/Endpoint/Element/index.js';

test('deleteElement results in API call', async () => {
  const deleteElementEndpoint = mock<DeleteElementEndpoint>();
  when(() => deleteElementEndpoint.deleteElement('b524701c-d0c3-43fd-bd46-368f4474183d'))
    .thenResolve({
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    deleteElementEndpoint,
  });

  const response = await apiWrapper.deleteElement('b524701c-d0c3-43fd-bd46-368f4474183d');
  expect(response).toBeUndefined();
});

test('deleteElement to expose errors', async () => {
  const deleteElementEndpoint = mock<DeleteElementEndpoint>();
  when(() => deleteElementEndpoint.deleteElement('6642dbd2-7549-417f-a619-fe642ccaa263'))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    deleteElementEndpoint,
  });

  await expect(() => apiWrapper.deleteElement('6642dbd2-7549-417f-a619-fe642ccaa263')).rejects.toThrowError(
    'some error',
  );
});
