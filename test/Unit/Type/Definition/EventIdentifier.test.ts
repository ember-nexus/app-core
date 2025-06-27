import { expect, test } from 'vitest';

import { validateEventIdentifierFromString } from '../../../../src/Type/Definition/index.js';

test('should validate correct event identifier', () => {
  expect(validateEventIdentifierFromString('root')).toBeTruthy();
  expect(validateEventIdentifierFromString('root.child')).toBeTruthy();
  expect(validateEventIdentifierFromString('root.child.other-child')).toBeTruthy();
});

test('should throw error on wrong event identifier', () => {
  expect(() => validateEventIdentifierFromString('Uppercase')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
  expect(() => validateEventIdentifierFromString('glob.in.identifier.*')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
  expect(() => validateEventIdentifierFromString('123132.numbers')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
  expect(() => validateEventIdentifierFromString('trailing.dot.')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
  expect(() => validateEventIdentifierFromString('.leading.dot')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
  expect(() => validateEventIdentifierFromString('double..dots')).toThrowError(
    'Passed variable is not a valid event identifier.',
  );
});
