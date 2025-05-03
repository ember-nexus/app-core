import { expect, test } from 'vitest';

import {
  Event,
  EventDispatcher,
  EventInterface,
  OptionalPromise,
  validateEventIdentifierFromString,
  validateEventListenerIdentifierFromString,
} from '../../../../src/Type/Definition';

test('event dispatcher can be created', () => {
  const eventDispatcher = new EventDispatcher();
  expect(eventDispatcher).toBeTruthy();
  expect(eventDispatcher.hasListeners(validateEventListenerIdentifierFromString('some-identifier'))).toBeFalsy();
});

test('dispatching event without corresponding event listener works', () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'));
  eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
});

test('dispatching event with single event listener works', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    (event: EventInterface): OptionalPromise<void> => {
      const called = event.getContextValue('called') as string[];
      called.push('listener 1');
      event.setContextValue('called', called);
      event.stopPropagation();
    },
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getContextValue('called')).toEqual(['listener 1']);
});
