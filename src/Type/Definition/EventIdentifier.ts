import { Branded } from './Branded.js';
import { ParseError } from '../../Error/index.js';

/**
 * Type safe variant of string containing event identifier.
 */
type EventIdentifier = Branded<string, 'eventIdentifier'> | string;

const eventIdentifierRegex = /^([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*$/;

function validateEventIdentifierFromString(eventIdentifier: string): EventIdentifier {
  if (!eventIdentifierRegex.test(eventIdentifier)) {
    throw new ParseError('Passed variable is not a valid event identifier.');
  }
  return eventIdentifier as EventIdentifier;
}

export { EventIdentifier, validateEventIdentifierFromString, eventIdentifierRegex };
