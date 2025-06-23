import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { NormalizedValueToRawValueEvent } from '../../../src/Event';
import { GenericNormalizedValueToRawValueEventListener } from '../../../src/EventListener';
import { EventInterface } from '../../../src/Type/Definition';

test('GenericNormalizedValueToRawValueEventListener provides correct event listener target', () => {
  expect(GenericNormalizedValueToRawValueEventListener.eventListenerTarget).toEqual(
    'ember-nexus.app-core.event.normalized-value-to-raw-value',
  );
});

test('GenericNormalizedValueToRawValueEventListener returns early for unknown event', () => {
  const event = mock<EventInterface>();
  when(() => event.getIdentifier())
    .thenReturn('some.other.event')
    .once();
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  expect(() => eventListener.onEvent(event as NormalizedValueToRawValueEvent)).not.toThrow();
});

test('GenericNormalizedValueToRawValueEventListener returns early for complex property, e.g. object', () => {
  const event = new NormalizedValueToRawValueEvent({});
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getRawValue()).toBeNull();
});

test('GenericNormalizedValueToRawValueEventListener handles string property', () => {
  const event = new NormalizedValueToRawValueEvent('string');
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual('string');
});

test('GenericNormalizedValueToRawValueEventListener handles number property', () => {
  const event = new NormalizedValueToRawValueEvent(1234);
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual(1234);
});

test('GenericNormalizedValueToRawValueEventListener handles boolean property', () => {
  const event = new NormalizedValueToRawValueEvent(true);
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual(true);
});

test('GenericNormalizedValueToRawValueEventListener handles array property', () => {
  const event = new NormalizedValueToRawValueEvent([1, 2, 3]);
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual([1, 2, 3]);
});

test('GenericNormalizedValueToRawValueEventListener handles null property', () => {
  const event = new NormalizedValueToRawValueEvent(null);
  const eventListener = new GenericNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual(null);
});
