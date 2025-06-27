import { expect, test } from 'vitest';

import { GetIndexEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('GetIndexEndpoint provides correct service identifier', () => {
  expect(GetIndexEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.get-index-endpoint');
});
