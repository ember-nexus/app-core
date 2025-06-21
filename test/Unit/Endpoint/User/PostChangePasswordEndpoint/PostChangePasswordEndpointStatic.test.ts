import { expect, test } from 'vitest';

import { PostChangePasswordEndpoint } from '../../../../../src/Endpoint/User';

test('PostChangePasswordEndpoint provides correct service identifier', () => {
  expect(PostChangePasswordEndpoint.identifier).toEqual(
    'ember-nexus.app-core.endpoint.user.post-change-password-endpoint',
  );
});
