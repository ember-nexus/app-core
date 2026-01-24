import { Token, validateTokenFromString } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

/**
 * Class which helps to parse tokens.
 */
class TokenParser {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceTokenParser;
  constructor() {}

  static constructFromServiceResolver(): TokenParser {
    return new TokenParser();
  }
  rawTokenToToken(token: object): Token {
    if (!('type' in token)) {
      throw new Error("Raw token must contain property 'type' in order to be parsed to a token.");
    }
    const type = String(token.type);
    if (type !== '_TokenResponse') {
      throw new Error("Type must be '_TokenResponse' in order to be parsed to a token.");
    }

    if (!('token' in token)) {
      throw new Error("Raw token must contain property 'token' in order to be parsed to a token.");
    }
    return validateTokenFromString(String(token.token));
  }
}

export { TokenParser };
