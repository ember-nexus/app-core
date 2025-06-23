import { NormalizedValueToRawValueEvent } from '../Event/index.js';
import { EventListener, EventListenerTarget } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class GenericNormalizedValueToRawValueEventListener implements EventListener<NormalizedValueToRawValueEvent> {
  static eventListenerTarget: EventListenerTarget = EventIdentifier.NormalizedValueToRawValueEvent;
  static priority: number = 0;

  constructor() {}

  static constructFromServiceResolver(): GenericNormalizedValueToRawValueEventListener {
    return new GenericNormalizedValueToRawValueEventListener();
  }

  onEvent(event: NormalizedValueToRawValueEvent): void {
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
