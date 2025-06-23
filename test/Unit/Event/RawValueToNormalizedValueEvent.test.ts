import { expect, test } from 'vitest';

import { RawValueToNormalizedValueEvent } from '../../../src/Event';

test('RawValueToNormalizedValueEvent provides correct event identifier', () => {
  expect(RawValueToNormalizedValueEvent.identifier).toEqual('ember-nexus.app-core.event.raw-value-to-normalized-value');
});

test('constructor sets raw value', () => {
  const event = new RawValueToNormalizedValueEvent('some raw value');
  expect(event.getRawValue()).toEqual('some raw value');
});

test('normalized value can be modified', () => {
  const event = new RawValueToNormalizedValueEvent('some raw value');
  expect(event.getNormalizedValue()).toBeNull();
  event.setNormalizedValue('some normalized value');
  expect(event.getNormalizedValue()).toEqual('some normalized value');
});

test('normalized value can not be modified once propagation is stopped', () => {
  const event = new RawValueToNormalizedValueEvent('some raw value');
  expect(event.getNormalizedValue()).toBeNull();
  event.setNormalizedValue('some normalized value');
  expect(event.getNormalizedValue()).toEqual('some normalized value');
  event.stopPropagation();
  event.setNormalizedValue('some new normalized value');
  expect(event.getNormalizedValue()).not.toEqual('some new normalized value');
  expect(event.getNormalizedValue()).toEqual('some normalized value');
});
