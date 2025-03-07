import { Branded } from './Branded.js';
import { ParseError } from '../../Error/index.js';

/**
 * Type safe variant of string containing service identifier.
 */
type ServiceIdentifier = Branded<string, 'serviceIdentifier'>;

const serviceIdentifierRegex = /^([a-z][a-z0-9-]*)(\.([a-z][a-z0-9-]*))*$/;

function validateServiceIdentifierFromString(serviceIdentifier: string): ServiceIdentifier {
  if (!serviceIdentifierRegex.test(serviceIdentifier)) {
    throw new ParseError('Passed variable is not a valid service identifier.');
  }
  return serviceIdentifier as ServiceIdentifier;
}

export { ServiceIdentifier, validateServiceIdentifierFromString, serviceIdentifierRegex };
