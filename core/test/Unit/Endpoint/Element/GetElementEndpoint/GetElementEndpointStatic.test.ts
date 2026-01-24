import { expect, test } from 'vitest';

import { GetElementEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('GetElementEndpoint provides correct service identifier', () => {
  expect(GetElementEndpoint.identifier).toEqual('ember-nexus.app-core.endpoint.element.get-element-endpoint');
});
