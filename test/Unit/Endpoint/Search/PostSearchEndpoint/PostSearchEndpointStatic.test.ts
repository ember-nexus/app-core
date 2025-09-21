import { expect, test } from 'vitest';

import { PostSearchEndpoint } from '../../../../../src/Endpoint/Search/index.js';

test('PostSearchEndpoint provides correct service identifier', () => {
  expect(PostSearchEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.search.post-search');
});
