import { expect, test } from 'vitest'

import { Registry } from '../../../../src/Type/Definition';

test('should return null on missing entry', () => {
  const registry = new Registry<string>();
  expect(registry.getEntry('iDoNotExist')).to.be.null;
});

test('should return the same element as set earlier', () => {
  const registry = new Registry<string>();
  registry.setEntry('key', 'someString');
  expect(registry.getEntry('key')).to.be.equal('someString');
});

test('should overwrite elements which were set earlier', () => {
  const registry = new Registry<string>();
  registry.setEntry('key', 'oldString');
  registry.setEntry('key', 'newString');
  expect(registry.getEntry('key')).to.be.equal('newString');
});

test('should return null for some set key after clear was run', () => {
  const registry = new Registry<string>();
  registry.setEntry('key', 'someString');
  registry.clearEntries();
  expect(registry.getEntry('iDoNotExist')).to.be.null;
});
