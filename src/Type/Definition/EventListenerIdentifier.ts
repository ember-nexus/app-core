import { Branded } from './Branded.js';
import { ParseError } from '../../Error/index.js';

/**
 * Type safe variant of string containing event identifier.
 */
type EventListenerIdentifier = Branded<string, 'eventListenerIdentifier'>;

const eventListenerIdentifierRegex =
  /^(?:([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*|\*|([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*(\.\*))$/;

function validateEventListenerIdentifierFromString(eventListenerIdentifier: string): EventListenerIdentifier {
  if (!eventListenerIdentifierRegex.test(eventListenerIdentifier)) {
    throw new ParseError('Passed variable is not a valid event listener identifier.');
  }
  return eventListenerIdentifier as EventListenerIdentifier;
}

export { EventListenerIdentifier, validateEventListenerIdentifierFromString, eventListenerIdentifierRegex };
