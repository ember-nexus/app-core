import { expect, test } from 'vitest';

import { validateTokenFromString } from '../../../../src/Type/Definition';

test('should validate correct token', () => {
  expect(validateTokenFromString('secret-token:123')).toBeTruthy();
  expect(validateTokenFromString('secret-token:abc')).toBeTruthy();
  expect(validateTokenFromString('secret-token:abc123')).toBeTruthy();
});

test('should throw error on wrong token', () => {
  expect(() => validateTokenFromString('not a token')).toThrowError('Passed variable is not a valid token.');
  expect(() => validateTokenFromString('secret-token:')).toThrowError('Passed variable is not a valid token.');
});
