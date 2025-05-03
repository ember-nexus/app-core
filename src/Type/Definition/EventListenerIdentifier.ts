import { Branded } from './Branded.js';
import { EventIdentifier } from './EventIdentifier.js';
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

function getEventListenerIdentifiersFromEventIdentifier(eventIdentifier: EventIdentifier): EventListenerIdentifier[] {
  const parts = eventIdentifier.split('.');
  const eventListenerIdentifiers: EventListenerIdentifier[] = [];
  eventListenerIdentifiers.push(validateEventListenerIdentifierFromString(eventIdentifier));
  for (let i = parts.length - 1; i > 0; i--) {
    eventListenerIdentifiers.push(validateEventListenerIdentifierFromString(parts.slice(0, i).join('.') + '.*'));
  }
  eventListenerIdentifiers.push(validateEventListenerIdentifierFromString('*'));
  return eventListenerIdentifiers;
}

export {
  EventListenerIdentifier,
  validateEventListenerIdentifierFromString,
  eventListenerIdentifierRegex,
  getEventListenerIdentifiersFromEventIdentifier,
};
