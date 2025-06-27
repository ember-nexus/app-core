import { expect, test } from 'vitest';

import { Event, EventIdentifier, validateEventIdentifierFromString } from '../../../../src/Type/Definition/index.js';

class TestEvent extends Event {
  constructor(identifier: EventIdentifier) {
    super(identifier);
  }
}

test('event can be created with just the event identifier', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new TestEvent(identifier);
  expect(event).toBeTruthy();
  expect(event.getIdentifier()).toEqual(identifier);
});

test('event can be stopped', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new TestEvent(identifier);
  expect(event.isPropagationStopped()).toBeFalsy();
  event.stopPropagation();
  expect(event.isPropagationStopped()).toBeTruthy();
});
