import { DateTime } from 'luxon';
import { mock, when } from 'strong-mock';
import { expect, test } from 'vitest';

import { RawValueToNormalizedValueEvent } from '../../../src/Event';
import { DateTimeRawValueToNormalizedValueEventListener } from '../../../src/EventListener';
import { EventInterface } from '../../../src/Type/Definition';

test('DateTimeRawValueToNormalizedValueEventListener provides correct event listener target', () => {
  expect(DateTimeRawValueToNormalizedValueEventListener.eventListenerTarget).toEqual(
    'ember-nexus.app-core.event.raw-value-to-normalized-value',
  );
});

test('DateTimeRawValueToNormalizedValueEventListener returns early for unknown event', () => {
  const event = mock<EventInterface>();
  when(() => event.getIdentifier())
    .thenReturn('some.other.event')
    .once();
  const eventListener = new DateTimeRawValueToNormalizedValueEventListener();

  expect(() => eventListener.onEvent(event as RawValueToNormalizedValueEvent)).not.toThrow();
});

test('DateTimeRawValueToNormalizedValueEventListener returns early for non string property', () => {
  const event = new RawValueToNormalizedValueEvent(1234);
  const eventListener = new DateTimeRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getNormalizedValue()).toBeNull();
});

test('DateTimeRawValueToNormalizedValueEventListener returns early for non date string property', () => {
  const event = new RawValueToNormalizedValueEvent('not a date');
  const eventListener = new DateTimeRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getNormalizedValue()).toBeNull();
});

test('DateTimeRawValueToNormalizedValueEventListener handles date property', () => {
  // const date = DateTime.fromFormat("2025.06.23 07:51:00", "yyyy.MM.dd HH:mm:ss", { zone: "utc" }).toJSDate();
  const event = new RawValueToNormalizedValueEvent('2025-06-23T07:56:00+00:00');
  const eventListener = new DateTimeRawValueToNormalizedValueEventListener();

  eventListener.onEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  const rawValue = event.getNormalizedValue() as Date;
  expect(rawValue).toBeInstanceOf(Date);
  expect(DateTime.fromJSDate(rawValue).toFormat('yyyy.MM.dd HH:mm:ss')).toEqual('2025.06.23 07:56:00');
});
