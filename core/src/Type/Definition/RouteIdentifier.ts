import { Branded } from './Branded.js';
import { ParseError } from '../../Error/index.js';

/**
 * Type safe variant of string containing route identifier.
 */
type RouteIdentifier = Branded<string, 'routeIdentifier'> | string;

const routeIdentifierRegex = /^([a-z]+)(-*[a-z0-9]+)*$/;

function validateRouteIdentifierFromString(routeIdentifier: string): RouteIdentifier {
  if (!routeIdentifierRegex.test(routeIdentifier)) {
    throw new ParseError('Passed variable is not a valid route identifier.');
  }
  return routeIdentifier as RouteIdentifier;
}

export { RouteIdentifier, routeIdentifierRegex, validateRouteIdentifierFromString };
