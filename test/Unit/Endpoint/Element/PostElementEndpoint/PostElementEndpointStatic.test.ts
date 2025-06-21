import { expect, test } from 'vitest';

import { PostElementEndpoint } from '../../../../../src/Endpoint/Element';

test('PostElementEndpoint provides correct service identifier', () => {
  expect(PostElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.post-element-endpoint');
});
