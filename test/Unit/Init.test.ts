import { expect, test } from 'vitest';

import { init } from '../../src';
import { GetServiceResolverEvent } from '../../src/BrowserEvent';
import { PriorityRegistry, Registry, validateServiceIdentifierFromString } from '../../src/Type/Definition';

/**
 * @vitest-environment jsdom
 */
test('should answer GetServiceResolverEvent browser events', () => {
  const rootNode = document.createElement('div');
  const serviceResolver = init(rootNode);

  const getServiceResolverEvent = new GetServiceResolverEvent();
  rootNode.dispatchEvent(getServiceResolverEvent);
  expect(getServiceResolverEvent.getServiceResolver()).toEqual(serviceResolver);
});

/**
 * @vitest-environment jsdom
 */
test('should return null for unknown services', () => {
  const rootNode = document.createElement('div');
  const serviceResolver = init(rootNode);

  const serviceIdentifier = validateServiceIdentifierFromString('i-do-not-exist');
  expect(serviceResolver.hasService(serviceIdentifier)).toBeFalsy();
  expect(serviceResolver.getService(serviceIdentifier)).toBeNull();
});

/**
 * @vitest-environment jsdom
 */
test('should have action registry registered', () => {
  const rootNode = document.createElement('div');
  const serviceResolver = init(rootNode);

  const serviceIdentifier = validateServiceIdentifierFromString('action');
  expect(serviceResolver.hasService(serviceIdentifier)).toBeTruthy();
  const actionRegistry = serviceResolver.getService(serviceIdentifier) as PriorityRegistry;
  expect(actionRegistry).toBeInstanceOf(PriorityRegistry);
});

/**
 * @vitest-environment jsdom
 */
test('should have setting registry registered', () => {
  const rootNode = document.createElement('div');
  const serviceResolver = init(rootNode);

  const serviceIdentifier = validateServiceIdentifierFromString('setting');
  expect(serviceResolver.hasService(serviceIdentifier)).toBeTruthy();
  const settingRegistry = serviceResolver.getService(serviceIdentifier) as Registry;
  expect(settingRegistry).toBeInstanceOf(Registry);
});

/**
 * @vitest-environment jsdom
 */
test('should have icon registry registered', () => {
  const rootNode = document.createElement('div');
  const serviceResolver = init(rootNode);

  const serviceIdentifier = validateServiceIdentifierFromString('icon');
  expect(serviceResolver.hasService(serviceIdentifier)).toBeTruthy();
  const iconRegistry = serviceResolver.getService(serviceIdentifier) as Registry;
  expect(iconRegistry).toBeInstanceOf(Registry);
});
