import { Branded } from './Branded.js';
import { EventIdentifier } from './EventIdentifier.js';
import { ParseError } from '../../Error/index.js';

/**
 * Type safe variant of string containing event identifier.
 */
type EventListenerTarget = Branded<string, 'eventListenerIdentifier'> | string;

const eventListenerTargetRegex =
  /^(?:([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*|\*|([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*(\.\*))$/;

function validateEventListenerTargetFromString(eventListenerIdentifier: string): EventListenerTarget {
  if (!eventListenerTargetRegex.test(eventListenerIdentifier)) {
    throw new ParseError('Passed variable is not a valid event listener target.');
  }
  return eventListenerIdentifier as EventListenerTarget;
}

function getEventListenerTargetsFromEventIdentifier(eventIdentifier: EventIdentifier): EventListenerTarget[] {
  const parts = eventIdentifier.split('.');
  const eventListenerTargets: EventListenerTarget[] = [];
  eventListenerTargets.push(validateEventListenerTargetFromString(eventIdentifier));
  for (let i = parts.length - 1; i > 0; i--) {
    eventListenerTargets.push(validateEventListenerTargetFromString(parts.slice(0, i).join('.') + '.*'));
  }
  eventListenerTargets.push(validateEventListenerTargetFromString('*'));
  return eventListenerTargets;
}

export {
  EventListenerTarget,
  eventListenerTargetRegex,
  getEventListenerTargetsFromEventIdentifier,
  validateEventListenerTargetFromString,
};
