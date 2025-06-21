import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache } from '../../../../src/Cache';
import { PatchElementEndpoint } from '../../../../src/Endpoint/Element';

test('patchElement results in API call', async () => {
  const data = {
    some: 'data',
  };

  const patchElementEndpoint = mock<PatchElementEndpoint>();
  when(() => patchElementEndpoint.patchElement('b524701c-d0c3-43fd-bd46-368f4474183d', data))
    .thenResolve({
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    patchElementEndpoint,
  });

  const response = await apiWrapper.patchElement('b524701c-d0c3-43fd-bd46-368f4474183d', data);
  expect(response).toBeUndefined();
});

test('patchElement to expose errors', async () => {
  const data = {
    some: 'data',
  };

  const patchElementEndpoint = mock<PatchElementEndpoint>();
  when(() => patchElementEndpoint.patchElement('6642dbd2-7549-417f-a619-fe642ccaa263', data))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    patchElementEndpoint,
  });

  await expect(() => apiWrapper.patchElement('6642dbd2-7549-417f-a619-fe642ccaa263', data)).rejects.toThrowError(
    'some error',
  );
});
