import { expect, test } from 'vitest';

import { PostTokenEndpoint } from '../../../../../src/Endpoint/User/index.js';

test('PostTokenEndpoint provides correct service identifier', () => {
  expect(PostTokenEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.user.post-token-endpoint');
});
