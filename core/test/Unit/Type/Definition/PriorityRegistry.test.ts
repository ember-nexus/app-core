import { expect, test } from 'vitest';

import { PriorityRegistry } from '../../../../src/Type/Definition/index.js';

test('should return null on missing entry', () => {
  const registry = new PriorityRegistry<string>();
  expect(registry.getEntry('iDoNotExist')).toBeNull();
});

test('should return the same element as set earlier', () => {
  const registry = new PriorityRegistry<string>();
  registry.setEntry('key', 'someString');
  expect(registry.getEntry('key')).toEqual('someString');
});

test('should not overwrite elements which were set earlier', () => {
  const registry = new PriorityRegistry<string>();
  registry.setEntry('key', 'oldString');
  registry.setEntry('key', 'newString');
  expect(registry.getEntry('key')).toEqual('oldString');
});

test('should return element with higher priority', () => {
  const registry = new PriorityRegistry<string>();
  registry.setEntry('key', 'lowPriority', 1);
  registry.setEntry('key', 'highPriority', 10);
  expect(registry.getEntry('key')).toEqual('highPriority');
  registry.clearEntries();
  registry.setEntry('key', 'highPriority', 10);
  registry.setEntry('key', 'lowPriority', 1);
  expect(registry.getEntry('key')).toEqual('highPriority');
});

test('should return null for some set key after clear was run', () => {
  const registry = new PriorityRegistry<string>();
  registry.setEntry('key', 'someString');
  registry.clearEntries();
  expect(registry.getEntry('iDoNotExist')).toBeNull();
});
