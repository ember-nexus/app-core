import { expect, test } from 'vitest';

import { DeleteTokenEndpoint } from '../../../../../src/Endpoint/User';

test('DeleteTokenEndpoint provides correct service identifier', () => {
  expect(DeleteTokenEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.user.delete-token-endpoint');
});
