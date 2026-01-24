import { expect, test } from 'vitest';

import { GetMeEndpoint } from '../../../../../src/Endpoint/User/index.js';

test('GetMeEndpoint provides correct service identifier', () => {
  expect(GetMeEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.user.get-me-endpoint');
});
