import { expect, test } from 'vitest';

import { PatchElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('PatchElementEndpoint provides correct service identifier', () => {
  expect(PatchElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.patch-element-endpoint');
});
