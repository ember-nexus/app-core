import { setImmediate } from 'timers/promises';

import { expect, test } from 'vitest';

import { EventDispatcher } from '../../../src/Service/index.js';
import { Event, EventIdentifier, EventListener } from '../../../src/Type/Definition/index.js';
import { TestLogger } from '../TestLogger.js';

class TestEvent extends Event {
  public context: string[] = [];

  constructor(identifier: EventIdentifier) {
    super(identifier);
  }
}

class TestEventListener implements EventListener<TestEvent> {
  constructor(
    private contextValue: string,
    private stopsEvent: boolean = false,
    private willThrow: boolean = false,
  ) {}

  onEvent(event: TestEvent): void {
    if (this.willThrow) throw new Error('some error');
    event.context.push(this.contextValue);
    if (this.stopsEvent) event.stopPropagation();
  }
}

class TestAsyncEventListener implements EventListener<TestEvent> {
  constructor(
    private contextValue: string,
    private stopsEvent: boolean = false,
    private willThrow: boolean = false,
  ) {}

  async onEvent(event: TestEvent): Promise<void> {
    await setImmediate();
    if (this.willThrow) throw new Error('some error');
    event.context.push(this.contextValue);
    if (this.stopsEvent) event.stopPropagation();
  }
}

function getEventDispatcher(): EventDispatcher {
  return new EventDispatcher(new TestLogger());
}

test('event dispatcher can be created', () => {
  const eventDispatcher = getEventDispatcher();
  expect(eventDispatcher).toBeTruthy();
  expect(eventDispatcher.hasListeners('some-identifier')).toBeFalsy();
});

test('dispatching event without corresponding event listener works', () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('event');
  eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
});

test('dispatching already stopped event leads to early return', () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('event');
  event.stopPropagation();
  eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
});

test('dispatching event with single sync event listener works', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestEventListener('sync listener', true));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.context).toEqual(['sync listener']);
});

test('dispatching event with single async event listener works', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestAsyncEventListener('async listener', true));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.context).toEqual(['async listener']);
});

test('priority of event listeners is respected', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestEventListener('low prio'), 0);
  eventDispatcher.addListener('test', new TestEventListener('medium prio'), 100);
  eventDispatcher.addListener('test', new TestEventListener('high prio'), 200);

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.context).toEqual(['high prio', 'medium prio', 'low prio']);
});

test('indirect registration priority of event listeners is respected', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestEventListener('first'));
  eventDispatcher.addListener('test', new TestEventListener('second'));
  eventDispatcher.addListener('test', new TestEventListener('third'));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.context).toEqual(['first', 'second', 'third']);
});

test('priority of event listener identifiers is respected', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('a.b.c');
  eventDispatcher.addListener('a.b.c', new TestEventListener('first'));
  eventDispatcher.addListener('a.b.*', new TestEventListener('second'));
  eventDispatcher.addListener('a.*', new TestEventListener('third'));
  eventDispatcher.addListener('*', new TestEventListener('fourth'));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.context).toEqual(['first', 'second', 'third', 'fourth']);
});

test('stoppable stops priority chain', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('a.b.c');
  eventDispatcher.addListener('a.b.c', new TestEventListener('first'));
  eventDispatcher.addListener('a.b.*', new TestEventListener('second', true));
  eventDispatcher.addListener('a.*', new TestEventListener('third'));
  eventDispatcher.addListener('*', new TestEventListener('fourth'));

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeTruthy();
  expect(event.context).toEqual(['first', 'second']);
});

test('exception in chain does not crash event dispatcher as a whole', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestEventListener('first'), 250);
  eventDispatcher.addListener('test', new TestEventListener('first', false, true), 200);
  eventDispatcher.addListener('test', new TestEventListener('third'), 150);

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.context).toEqual(['first', 'third']);
});

test('error in promise in chain does not crash event dispatcher as a whole', async () => {
  const eventDispatcher = getEventDispatcher();
  const event = new TestEvent('test');
  eventDispatcher.addListener('test', new TestAsyncEventListener('first'), 250);
  eventDispatcher.addListener('test', new TestAsyncEventListener('second', false, true), 200);
  eventDispatcher.addListener('test', new TestAsyncEventListener('third'), 150);

  await eventDispatcher.dispatchEvent(event);
  expect(event.isPropagationStopped()).toBeFalsy();
  expect(event.context).toEqual(['first', 'third']);
});

test('get listeners returns empty array if no listeners are found', () => {
  const eventDispatcher = getEventDispatcher();

  const eventListeners = eventDispatcher.getListeners('i.do.not.exist');
  expect(eventListeners).toHaveLength(0);
});

test('get listeners returns registered event listeners', () => {
  const eventDispatcher = getEventDispatcher();
  const firstEventListener = new TestEventListener('first');
  eventDispatcher.addListener('test', firstEventListener);
  const secondEventListener = new TestEventListener('second');
  eventDispatcher.addListener('test', secondEventListener);

  const eventListeners = eventDispatcher.getListeners('test');
  expect(eventListeners).toHaveLength(2);
  expect(eventListeners).toContain(firstEventListener);
  expect(eventListeners).toContain(secondEventListener);
});

test('get listeners does not return event listener with different identifier', () => {
  const otherEventListenerIdentifier = 'other';
  const eventDispatcher = getEventDispatcher();
  const firstEventListener = new TestEventListener('first');
  eventDispatcher.addListener('test', firstEventListener);
  const secondEventListener = new TestEventListener('second');
  eventDispatcher.addListener(otherEventListenerIdentifier, secondEventListener);

  const eventListeners = eventDispatcher.getListeners('test');
  expect(eventListeners).toHaveLength(1);
  expect(eventListeners).toContain(firstEventListener);
});

test('has listeners works', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListener = new TestEventListener('some listener');

  expect(eventDispatcher.hasListeners('test')).toBeFalsy();
  eventDispatcher.addListener('test', eventListener);
  expect(eventDispatcher.hasListeners('test')).toBeTruthy();
  eventDispatcher.removeListener('test', eventListener);
  expect(eventDispatcher.hasListeners('test')).toBeFalsy();
});

test('remove listener does nothing if no event listeners were defined', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListener = new TestEventListener('some listener');

  expect(eventDispatcher.removeListener('test', eventListener)).toBeTruthy();
});

test('remove listener does nothing if the deleted event listener is not found', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListener = new TestEventListener('some listener');
  const otherEventListener = new TestEventListener('other listener');
  eventDispatcher.addListener('test', otherEventListener);

  expect(eventDispatcher.removeListener('test', eventListener)).toBeTruthy();
});

test('remove listener does remove registered event listener', () => {
  const eventDispatcher = getEventDispatcher();
  const eventListener = new TestEventListener('some listener');

  eventDispatcher.addListener('test', eventListener);
  expect(eventDispatcher.hasListeners('test')).toBeTruthy();
  eventDispatcher.removeListener('test', eventListener);
  expect(eventDispatcher.hasListeners('test')).toBeFalsy();
});
