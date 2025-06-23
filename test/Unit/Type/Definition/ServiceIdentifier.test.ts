import { expect, test } from 'vitest';

import { validateServiceIdentifierFromString } from '../../../../src/Type/Definition';

test('should validate correct service identifier', () => {
  expect(validateServiceIdentifierFromString('root')).toBeTruthy();
  expect(validateServiceIdentifierFromString('root.child')).toBeTruthy();
  expect(validateServiceIdentifierFromString('root.child.other-child')).toBeTruthy();
});

test('should throw error on wrong service identifier', () => {
  expect(() => validateServiceIdentifierFromString('Uppercase')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
  expect(() => validateServiceIdentifierFromString('glob.in.identifier.*')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
  expect(() => validateServiceIdentifierFromString('123132.numbers')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
  expect(() => validateServiceIdentifierFromString('trailing.dot.')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
  expect(() => validateServiceIdentifierFromString('.leading.dot')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
  expect(() => validateServiceIdentifierFromString('double..dots')).toThrowError(
    'Passed variable is not a valid service identifier.',
  );
});
