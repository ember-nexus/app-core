import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { createApiWrapper } from './ApiWrapper';
import { ElementCache } from '../../../../src/Cache';
import { PutElementEndpoint } from '../../../../src/Endpoint/Element';

test('putElement results in API call', async () => {
  const data = {
    some: 'data',
  };

  const putElementEndpoint = mock<PutElementEndpoint>();
  when(() => putElementEndpoint.putElement('2494e32b-2c82-4afc-8ff9-1fc004b6611c', data))
    .thenResolve({
      response: new Response(''),
    })
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    putElementEndpoint,
  });

  const response = await apiWrapper.putElement('2494e32b-2c82-4afc-8ff9-1fc004b6611c', data);
  expect(response).toBeUndefined();
});

test('putElement to expose errors', async () => {
  const data = {
    some: 'data',
  };

  const putElementEndpoint = mock<PutElementEndpoint>();
  when(() => putElementEndpoint.putElement('6cb93429-ed16-4540-8369-075481d6d86a', data))
    .thenReject(new Error('some error'))
    .once();

  const apiWrapper = createApiWrapper({
    elementCache: new ElementCache(),
    putElementEndpoint,
  });

  await expect(() => apiWrapper.putElement('6cb93429-ed16-4540-8369-075481d6d86a', data)).rejects.toThrowError(
    'some error',
  );
});
