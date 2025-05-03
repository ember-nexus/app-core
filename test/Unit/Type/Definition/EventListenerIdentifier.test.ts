import { expect, test } from 'vitest';

import {
  getEventListenerIdentifiersFromEventIdentifier,
  validateEventIdentifierFromString,
  validateEventListenerIdentifierFromString,
} from '../../../../src/Type/Definition';

test('should validate correct event listener identifier', () => {
  expect(validateEventListenerIdentifierFromString('root')).toBeTruthy();
  expect(validateEventListenerIdentifierFromString('root.child')).toBeTruthy();
  expect(validateEventListenerIdentifierFromString('root.child.*')).toBeTruthy();
  expect(validateEventListenerIdentifierFromString('root.*')).toBeTruthy();
  expect(validateEventListenerIdentifierFromString('*')).toBeTruthy();
});

test('should throw error on wrong event listener identifier', () => {
  expect(() => validateEventListenerIdentifierFromString('Uppercase')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('multiple.glob.*.*')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('*.glob.at.start')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('glob.*.in.middle')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('123132.numbers')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('trailing.dot.')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('.leading.dot')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
  expect(() => validateEventListenerIdentifierFromString('double..dots')).toThrowError(
    'Passed variable is not a valid event listener identifier.',
  );
});

test('expect getEventListenerIdentifiersFromEventIdentifier to build correct identifiers in correct ordering', () => {
  const eventListenerIdentifiers = getEventListenerIdentifiersFromEventIdentifier(
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

test('expect getEventListenerIdentifiersFromEventIdentifier to always return at least two event listener identifiers', () => {
  const eventListenerIdentifiers = getEventListenerIdentifiersFromEventIdentifier(
    validateEventIdentifierFromString('a'),
  );
  expect(eventListenerIdentifiers).toHaveLength(2);
  expect(eventListenerIdentifiers[0]).toEqual('a');
  expect(eventListenerIdentifiers[1]).toEqual('*');
});

test('expect getEventListenerIdentifiersFromEventIdentifier to always return three event listener identifiers with single dot in event identifier', () => {
  const eventListenerIdentifiers = getEventListenerIdentifiersFromEventIdentifier(
    validateEventIdentifierFromString('aaa.bbb'),
  );
  expect(eventListenerIdentifiers).toHaveLength(3);
  expect(eventListenerIdentifiers[0]).toEqual('aaa.bbb');
  expect(eventListenerIdentifiers[1]).toEqual('aaa.*');
  expect(eventListenerIdentifiers[2]).toEqual('*');
});
