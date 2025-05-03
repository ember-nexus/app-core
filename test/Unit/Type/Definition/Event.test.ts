import { expect, test } from 'vitest';

import { Event, validateEventIdentifierFromString } from '../../../../src/Type/Definition';

test('event can be created with just the event identifier', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new Event(identifier);
  expect(event).toBeTruthy();
  expect(event.getIdentifier()).toEqual(identifier);
  expect(event.getContext()).toEqual({});
});

test('event can be created with some context data', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new Event(identifier, { a: 'aaa', b: 'bbb' });
  expect(event).toBeTruthy();
  expect(event.getIdentifier()).toEqual(identifier);
  expect(event.getContext()).toEqual({ a: 'aaa', b: 'bbb' });
});

test('event can be stopped', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new Event(identifier);
  expect(event.isPropagationStopped()).toBeFalsy();
  event.stopPropagation();
  expect(event.isPropagationStopped()).toBeTruthy();
});

test('event context methods work', () => {
  const identifier = validateEventIdentifierFromString('identifier');
  const event = new Event(identifier);

  expect(event.getContextValue('iDoNotExist')).toBeUndefined();
  event.clearContextValue('iDoNotExist');
  event.clearContext();
  expect(event.getContext()).toEqual({});

  event.setContext({ key: 'value' });
  expect(event.getContextValue('key')).toEqual('value');
  event.setContextValue('otherKey', 'otherValue');
  expect(event.getContextValue('otherKey')).toEqual('otherValue');
  expect(event.hasContextValue('otherKey')).toBeTruthy();
  event.clearContextValue('otherKey');
  expect(event.hasContextValue('otherKey')).toBeFalsy();
  expect(event.getContextValue('otherKey')).toBeUndefined();

  event.clearContext();
  expect(event.getContext()).toEqual({});
});
