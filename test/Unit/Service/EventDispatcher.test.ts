import { expect, test } from 'vitest';

import { EventDispatcher } from '../../../src/Service';
import {
  Event,
  EventInterface,
  EventListener,
  OptionalPromise,
  validateEventIdentifierFromString,
  validateEventListenerIdentifierFromString,
} from '../../../src/Type/Definition';
import { TestLogger } from '../TestLogger';

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

function getEventDispatcher(): EventDispatcher {
  return new EventDispatcher(new TestLogger());
}

test('event dispatcher can be created', () => {
  const eventDispatcher = getEventDispatcher();
  expect(eventDispatcher).toBeTruthy();
  expect(eventDispatcher.hasListeners(validateEventListenerIdentifierFromString('some-identifier'))).toBeFalsy();
});

test('dispatching event without corresponding event listener works', () => {
  const eventDispatcher = getEventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'));
  eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
});

test('dispatching already stopped event leads to early return', () => {
  const eventDispatcher = getEventDispatcher();
  const event = new Event(validateEventIdentifierFromString('event'));
  event.stopPropagation();
  eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
});

test('dispatching event with single sync event listener works', async () => {
  const eventDispatcher = getEventDispatcher();
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
  const eventDispatcher = getEventDispatcher();
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
  const eventDispatcher = getEventDispatcher();
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
  const eventDispatcher = getEventDispatcher();
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
  const eventDispatcher = getEventDispatcher();
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
  const eventDispatcher = getEventDispatcher();
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

test('exception in chain does not crash event dispatcher as a whole', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new Event(validateEventIdentifierFromString('test'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    createAnonymousEventListener('first'),
    250,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    (): OptionalPromise<void> => {
      throw new Error('some error');
    },
    200,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    createAnonymousEventListener('third'),
    150,
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getContextValue('called')).toEqual(['first', 'third']);
});

test('error in promise in chain does not crash event dispatcher as a whole', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new Event(validateEventIdentifierFromString('test'), { called: [] });
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    createAnonymousEventListener('first'),
    250,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    (): OptionalPromise<void> => {
      return new Promise((_resolve, reject) => {
        reject(new Error('Some error'));
      });
    },
    200,
  );
  eventDispatcher.addListener(
    validateEventListenerIdentifierFromString('test'),
    createAnonymousEventListener('third'),
    150,
  );

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.getContextValue('called')).toEqual(['first', 'third']);
});

test('get listeners returns empty array if no listeners are found', () => {
  const eventDispatcher = getEventDispatcher();

  const eventListeners = eventDispatcher.getListeners(validateEventListenerIdentifierFromString('i.do.not.exist'));
  expect(eventListeners).toHaveLength(0);
});

test('get listeners returns registered event listeners', () => {
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const eventDispatcher = getEventDispatcher();
  const firstEventListener = createAnonymousEventListener('first');
  eventDispatcher.addListener(eventListenerIdentifier, firstEventListener);
  const secondEventListener = createAnonymousEventListener('second');
  eventDispatcher.addListener(eventListenerIdentifier, secondEventListener);

  const eventListeners = eventDispatcher.getListeners(eventListenerIdentifier);
  expect(eventListeners).toHaveLength(2);
  expect(eventListeners).toContain(firstEventListener);
  expect(eventListeners).toContain(secondEventListener);
});

test('get listeners does not return event listener with different identifier', () => {
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const otherEventListenerIdentifier = validateEventListenerIdentifierFromString('other');
  const eventDispatcher = getEventDispatcher();
  const firstEventListener = createAnonymousEventListener('first');
  eventDispatcher.addListener(eventListenerIdentifier, firstEventListener);
  const secondEventListener = createAnonymousEventListener('second');
  eventDispatcher.addListener(otherEventListenerIdentifier, secondEventListener);

  const eventListeners = eventDispatcher.getListeners(eventListenerIdentifier);
  expect(eventListeners).toHaveLength(1);
  expect(eventListeners).toContain(firstEventListener);
});

test('has listeners works', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const eventListener = createAnonymousEventListener('some listener');

  expect(eventDispatcher.hasListeners(eventListenerIdentifier)).toBeFalsy();
  eventDispatcher.addListener(eventListenerIdentifier, eventListener);
  expect(eventDispatcher.hasListeners(eventListenerIdentifier)).toBeTruthy();
  eventDispatcher.removeListener(eventListenerIdentifier, eventListener);
  expect(eventDispatcher.hasListeners(eventListenerIdentifier)).toBeFalsy();
});

test('remove listener does nothing if no event listeners were defined', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const eventListener = createAnonymousEventListener('some listener');

  expect(eventDispatcher.removeListener(eventListenerIdentifier, eventListener)).toBeTruthy();
});

test('remove listener does nothing if the deleted event listener is not found', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const eventListener = createAnonymousEventListener('some listener');
  const otherEventListener = createAnonymousEventListener('other listener');
  eventDispatcher.addListener(eventListenerIdentifier, otherEventListener);

  expect(eventDispatcher.removeListener(eventListenerIdentifier, eventListener)).toBeTruthy();
});

test('remove listener does remove registered event listener', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListenerIdentifier = validateEventListenerIdentifierFromString('event');
  const eventListener = createAnonymousEventListener('some listener');

  eventDispatcher.addListener(eventListenerIdentifier, eventListener);
  expect(eventDispatcher.hasListeners(eventListenerIdentifier)).toBeTruthy();
  eventDispatcher.removeListener(eventListenerIdentifier, eventListener);
  expect(eventDispatcher.hasListeners(eventListenerIdentifier)).toBeFalsy();
});
