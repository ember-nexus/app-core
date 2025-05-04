import { expect, test } from 'vitest';

import {
  Event,
  EventDispatcher,
  EventInterface,
  EventListener,
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

function createAnonymousEventListener(calledValue: string, stopsEvent: boolean = false): EventListener {
  return (event: EventInterface): OptionalPromise<void> => {
    const called = event.getContextValue('called') as string[];
    called.push(calledValue);
    event.setContextValue('called', called);
    if (stopsEvent) {
      event.stopPropagation();
    }
  };
}

test('dispatching event with single sync event listener works', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('sync listener', true),
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getContextValue('called')).toEqual(['sync listener']);
});

test('dispatching event with single async event listener works', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    (event: EventInterface): OptionalPromise<void> => {
      return Promise.resolve().then(() => {
        const called = event.getContextValue('called') as string[];
        called.push('async listener');
        event.setContextValue('called', called);
        event.stopPropagation();
        return;
      });
    },
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getContextValue('called')).toEqual(['async listener']);
});

test('priority of event listeners is respected', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('low prio'),
    0,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('medium prio'),
    100,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('high prio'),
    200,
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getContextValue('called')).toEqual(['high prio', 'medium prio', 'low prio']);
});

test('indirect registration priority of event listeners is respected', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('first'),
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('second'),
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('event'),
    createAnonymousEventListener('third'),
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getContextValue('called')).toEqual(['first', 'second', 'third']);
});

test('priority of event listener identifiers is respected', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('a.b.c'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('a.b.c'),
    createAnonymousEventListener('first'),
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('a.b.*'),
    createAnonymousEventListener('second'),
  );
  eventDispatcher.addListener(validateEventListenerIdentifierFromString('a.*'), createAnonymousEventListener('third'));
  eventDispatcher.addListener(validateEventListenerIdentifierFromString('*'), createAnonymousEventListener('fourth'));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getContextValue('called')).toEqual(['first', 'second', 'third', 'fourth']);
});

test('stoppable stops priority chain', async () => {
  const eventDispatcher = new EventDispatcher();
  const event = new Event(validateEventIdentifierFromString('a.b.c'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('a.b.c'),
    createAnonymousEventListener('first'),
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('a.b.*'),
    createAnonymousEventListener('second', true),
  );
  eventDispatcher.addListener(validateEventListenerIdentifierFromString('a.*'), createAnonymousEventListener('third'));
  eventDispatcher.addListener(validateEventListenerIdentifierFromString('*'), createAnonymousEventListener('fourth'));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.getContextValue('called')).toEqual(['first', 'second']);
});
