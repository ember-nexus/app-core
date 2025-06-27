import { expect, test } from 'vitest';

import { GetElementParentsEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('GetElementParentsEndpoint provides correct service identifier', () => {
  expect(GetElementParentsEndpoint.identifier).toEqual(
    'ember-nexus.app-core.endpoint.element.get-element-parents-endpoint',
  );
});
