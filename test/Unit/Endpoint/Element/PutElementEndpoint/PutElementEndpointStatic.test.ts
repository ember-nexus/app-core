import { expect, test } from 'vitest';

import { PutElementEndpoint } from '../../../../../src/Endpoint/Element';

test('PutElementEndpoint provides correct service identifier', () => {
  expect(PutElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.put-element-endpoint');
});
