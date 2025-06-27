import { expect, test } from 'vitest';

import { GetTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';

test('GetTokenEndpoint provides correct service identifier', () => {
  expect(GetTokenEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.user.get-token-endpoint');
});
