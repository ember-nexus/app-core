import { expect, test } from 'vitest';

import { DeleteElementEndpoint } from '../../../../../src/Endpoint/Element';

test('DeleteElementEndpoint provides correct service identifier', () => {
  expect(DeleteElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.delete-element-endpoint');
});
