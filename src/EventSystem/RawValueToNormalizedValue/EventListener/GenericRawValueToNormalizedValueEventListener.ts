import { Service } from 'typedi';

import { EventSystemListener } from '../../../Type/Definition/index.js';
import { RawValueToNormalizedValueEvent } from '../Event/index.js';

/**
 * Skips conversion of primitive data types and sets them directly.
 *
 * **⚠️ Warning**: This is an internal class. You should not use it directly.
 *
 * @internal
 */
@Service()
class GenericRawValueToNormalizedValueEventListener implements EventSystemListener<RawValueToNormalizedValueEvent> {
  triggerOnEvent(event: RawValueToNormalizedValueEvent): void {
    const rawValue = event.getRawValue();
    if (
      Array.isArray(rawValue) ||
      typeof rawValue === 'number' ||
      typeof rawValue === 'boolean' ||
      typeof rawValue === 'string' ||
      rawValue === null
    ) {
      event.setNormalizedValue(rawValue);
      event.stopPropagation();
    }
  }
}

export { GenericRawValueToNormalizedValueEventListener };
