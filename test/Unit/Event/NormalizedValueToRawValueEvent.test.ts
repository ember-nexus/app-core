import { expect, test } from 'vitest';

import { NormalizedValueToRawValueEvent } from '../../../src/Event';

test('NormalizedValueToRawValueEvent provides correct event identifier', () => {
  expect(NormalizedValueToRawValueEvent.identifier).toEqual('ember-nexus.app-core.event.normalized-value-to-raw-value');
});

test('constructor sets normalized value', () => {
  const event = new NormalizedValueToRawValueEvent('some normalized value');
  expect(event.getNormalizedValue()).toEqual('some normalized value');
});

test('raw value can be modified', () => {
  const event = new NormalizedValueToRawValueEvent('some normalized value');
  expect(event.getRawValue()).toBeNull();
  event.setRawValue('some raw value');
  expect(event.getRawValue()).toEqual('some raw value');
});

test('raw value can not be modified once propagation is stopped', () => {
  const event = new NormalizedValueToRawValueEvent('some normalized value');
  expect(event.getRawValue()).toBeNull();
  event.setRawValue('some raw value');
  expect(event.getRawValue()).toEqual('some raw value');
  event.stopPropagation();
  event.setRawValue('some new raw value');
  expect(event.getRawValue()).not.toEqual('some new raw value');
  expect(event.getRawValue()).toEqual('some raw value');
});
