import { expect, test } from 'vitest';

import { GetElementRelatedEndpoint } from '../../../../../src/Endpoint/Element/index.js';

test('GetElementRelatedEndpoint provides correct service identifier', () => {
  expect(GetElementRelatedEndpoint.identifier).toEqual(
    'ember-nexus.app-core.endpoint.element.get-element-related-endpoint',
  );
});
