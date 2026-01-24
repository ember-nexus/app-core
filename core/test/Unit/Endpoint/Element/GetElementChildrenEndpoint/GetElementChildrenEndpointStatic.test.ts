import { expect, test } from 'vitest';

import { GetElementChildrenEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('GetElementChildrenEndpoint provides correct service identifier', () => {
  expect(GetElementChildrenEndpoint.identifier).toEqual(
    'ember-nexus.app-core.endpoint.element.get-element-children-endpoint',
  );
});
