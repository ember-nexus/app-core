import { DateTime } from 'luxon';
import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { NormalizedValueToRawValueEvent } from '../../../src/Event';
import { DateTimeNormalizedValueToRawValueEventListener } from '../../../src/EventListener';
import { EventInterface } from '../../../src/Type/Definition';

test('DateTimeNormalizedValueToRawValueEventListener provides correct event listener target', () => {
  expect(DateTimeNormalizedValueToRawValueEventListener.eventListenerTarget).toEqual(
    'ember-nexus.app-core.event.normalized-value-to-raw-value',
  );
});

test('DateTimeNormalizedValueToRawValueEventListener returns early for unknown event', () => {
  const event = mock<EventInterface>();
  when(() => event.getIdentifier())
    .thenReturn('some.other.event')
    .once();
  const eventListener = new DateTimeNormalizedValueToRawValueEventListener();

  expect(() => eventListener.onEvent(event as NormalizedValueToRawValueEvent)).not.toThrow();
});

test('DateTimeNormalizedValueToRawValueEventListener returns early for non date property', () => {
  const event = new NormalizedValueToRawValueEvent('string');
  const eventListener = new DateTimeNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getRawValue()).toBeNull();
});

test('DateTimeNormalizedValueToRawValueEventListener handles date property', () => {
  const date = DateTime.fromFormat('2025.06.23 07:51:00', 'yyyy.MM.dd HH:mm:ss', { zone: 'utc' }).toJSDate();
  const event = new NormalizedValueToRawValueEvent(date);
  const eventListener = new DateTimeNormalizedValueToRawValueEventListener();

  eventListener.onEvent(event as NormalizedValueToRawValueEvent);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getRawValue()).toEqual('2025-06-23T07:51:00+00:00');
});
