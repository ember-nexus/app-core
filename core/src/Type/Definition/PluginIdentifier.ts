import { Branded } from './Branded.js';
import { ParseError } from '../../Error/ParseError.js';

/**
 * Type safe variant of string containing plugin identifier.
 */
type PluginIdentifier = Branded<string, 'pluginIdentifier'>;

const pluginIdentifierRegex = /^([a-z]+)(-*[a-z0-9]+)*$/;

function validatePluginIdentifierFromString(pluginIdentifier: string): PluginIdentifier {
  if (!pluginIdentifierRegex.test(pluginIdentifier)) {
    throw new ParseError('Passed variable is not a valid plugin identifier.');
  }
  return pluginIdentifier as PluginIdentifier;
}

export { PluginIdentifier, pluginIdentifierRegex, validatePluginIdentifierFromString };
