import { expect, test } from 'vitest';

import { PostIndexEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('PostIndexEndpoint provides correct service identifier', () => {
  expect(PostIndexEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.post-index-endpoint');
});
