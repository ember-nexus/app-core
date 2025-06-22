import { RawValueToNormalizedValueEvent } from '../Event/index.js';
import { EventSystemListener } from '../Type/Definition/index.js';

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
