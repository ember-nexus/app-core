import { EventSystemListener } from '../../../Type/Definition/index.js';
import { NormalizedValueToRawValueEvent } from '../Event/index.js';

class GenericNormalizedValueToRawValueEventListener implements EventSystemListener<NormalizedValueToRawValueEvent> {
  triggerOnEvent(event: NormalizedValueToRawValueEvent): void {
    const normalizedValue = event.getNormalizedValue();
    if (
      Array.isArray(normalizedValue) ||
      typeof normalizedValue === 'number' ||
      typeof normalizedValue === 'boolean' ||
      typeof normalizedValue === 'string' ||
      normalizedValue === null
    ) {
      event.setRawValue(normalizedValue);
      event.stopPropagation();
    }
  }
}

export { GenericNormalizedValueToRawValueEventListener };
