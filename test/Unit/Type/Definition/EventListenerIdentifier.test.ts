import { expect, test } from 'vitest';

import {
  getEventListenerTargetsFromEventIdentifier,
  validateEventIdentifierFromString,
  validateEventListenerTargetFromString,
} from '../../../../src/Type/Definition/index.js';

test('should validate correct event listener target', () => {
  expect(validateEventListenerTargetFromString('root')).toBeTruthy();
  expect(validateEventListenerTargetFromString('root.child')).toBeTruthy();
  expect(validateEventListenerTargetFromString('root.child.*')).toBeTruthy();
  expect(validateEventListenerTargetFromString('root.*')).toBeTruthy();
  expect(validateEventListenerTargetFromString('*')).toBeTruthy();
});

test('should throw error on wrong event listener target', () => {
  expect(() => validateEventListenerTargetFromString('Uppercase')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('multiple.glob.*.*')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('*.glob.at.start')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('glob.*.in.middle')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('123132.numbers')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('trailing.dot.')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('.leading.dot')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
  expect(() => validateEventListenerTargetFromString('double..dots')).toThrowError(
    'Passed variable is not a valid event listener target.',
  );
});

test('expect getEventListenerIdentifiersFromEventIdentifier to build correct targets in correct ordering', () => {
  const eventListenerIdentifiers = getEventListenerTargetsFromEventIdentifier(
    validateEventIdentifierFromString('a.b.c.d.e.f'),
  );
  expect(eventListenerIdentifiers).toHaveLength(7);
  expect(eventListenerIdentifiers[0]).toEqual('a.b.c.d.e.f');
  expect(eventListenerIdentifiers[1]).toEqual('a.b.c.d.e.*');
  expect(eventListenerIdentifiers[2]).toEqual('a.b.c.d.*');
  expect(eventListenerIdentifiers[3]).toEqual('a.b.c.*');
  expect(eventListenerIdentifiers[4]).toEqual('a.b.*');
  expect(eventListenerIdentifiers[5]).toEqual('a.*');
  expect(eventListenerIdentifiers[6]).toEqual('*');
});

test('expect getEventListenerIdentifiersFromEventIdentifier to always return at least two event listener targets', () => {
  const eventListenerIdentifiers = getEventListenerTargetsFromEventIdentifier(validateEventIdentifierFromString('a'));
  expect(eventListenerIdentifiers).toHaveLength(2);
  expect(eventListenerIdentifiers[0]).toEqual('a');
  expect(eventListenerIdentifiers[1]).toEqual('*');
});

test('expect getEventListenerIdentifiersFromEventIdentifier to always return three event listener targets with single dot in event target', () => {
  const eventListenerIdentifiers = getEventListenerTargetsFromEventIdentifier(
    validateEventIdentifierFromString('aaa.bbb'),
  );
  expect(eventListenerIdentifiers).toHaveLength(3);
  expect(eventListenerIdentifiers[0]).toEqual('aaa.bbb');
  expect(eventListenerIdentifiers[1]).toEqual('aaa.*');
  expect(eventListenerIdentifiers[2]).toEqual('*');
});
