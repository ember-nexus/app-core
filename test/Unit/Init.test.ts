import { expect, test } from 'vitest'
import {JSDOM} from "jsdom"

import { init } from '../../src';
import {validateServiceIdentifierFromString} from "../../src/Type/Definition";

test('should have default services registered', () => {
  const dom = new JSDOM();
  const document = dom.window.document;

  const rootNode = document.createElement('div');

  const serviceResolver = init(rootNode);

  expect(serviceResolver.hasService(validateServiceIdentifierFromString('action'))).to.be.true;
});
