import { expect, test } from 'vitest';

import { PostRegisterEndpoint } from '../../../../../src/Endpoint/User';

test('PostRegisterEndpoint provides correct service identifier', () => {
  expect(PostRegisterEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.user.post-register-endpoint');
});
