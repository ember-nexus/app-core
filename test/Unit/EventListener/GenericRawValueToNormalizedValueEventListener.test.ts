import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { RawValueToNormalizedValueEvent } from '../../../src/Event';
import { GenericRawValueToNormalizedValueEventListener } from '../../../src/EventListener';
import { EventInterface } from '../../../src/Type/Definition';

test('GenericRawValueToNormalizedValueEventListener provides correct event listener target', () => {
  expect(GenericRawValueToNormalizedValueEventListener.eventListenerTarget).toEqual(
    'ember-nexus.app-core.event.raw-value-to-normalized-value',
  );
});

test('GenericRawValueToNormalizedValueEventListener returns early for unknown event', () => {
  const event = mock<EventInterface>();
  when(() => event.getIdentifier())
    .thenReturn('some.other.event')
    .once();
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  expect(() => eventListener.onEvent(event as RawValueToNormalizedValueEvent)).not.toThrow();
});

test('GenericRawValueToNormalizedValueEventListener returns early for complex property, e.g. object', () => {
  const event = new RawValueToNormalizedValueEvent({});
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getNormalizedValue()).toBeNull();
});

test('GenericRawValueToNormalizedValueEventListener handles string property', () => {
  const event = new RawValueToNormalizedValueEvent('string');
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getNormalizedValue()).toEqual('string');
});

test('GenericRawValueToNormalizedValueEventListener handles number property', () => {
  const event = new RawValueToNormalizedValueEvent(1234);
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getNormalizedValue()).toEqual(1234);
});

test('GenericRawValueToNormalizedValueEventListener handles boolean property', () => {
  const event = new RawValueToNormalizedValueEvent(true);
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getNormalizedValue()).toEqual(true);
});

test('GenericRawValueToNormalizedValueEventListener handles array property', () => {
  const event = new RawValueToNormalizedValueEvent([1, 2, 3]);
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getNormalizedValue()).toEqual([1, 2, 3]);
});

test('GenericRawValueToNormalizedValueEventListener handles null property', () => {
  const event = new RawValueToNormalizedValueEvent(null);
  const eventListener = new GenericRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event as RawValueToNormalizedValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getNormalizedValue()).toEqual(null);
});
