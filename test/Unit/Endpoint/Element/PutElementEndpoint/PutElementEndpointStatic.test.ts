import { expect, test } from 'vitest';

import { PutElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('PutElementEndpoint provides correct service identifier', () => {
  expect(PutElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.put-element-endpoint');
});
