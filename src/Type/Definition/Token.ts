import { Branded } from './Branded.js';

/**
 * Type safe variant of string containing single token.
 */
type Token = Branded<string, 'Token'>;

const tokenRegex = /^secret-token:.+$/;

function validateTokenFromString(token: string): Token {
  if (!tokenRegex.test(token)) {
    throw new Error('Passed variable is not a valid token.');
  }
  return token as Token;
}

export { Token, tokenRegex, validateTokenFromString };
