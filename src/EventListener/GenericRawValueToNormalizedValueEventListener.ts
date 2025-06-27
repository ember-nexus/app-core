import { RawValueToNormalizedValueEvent } from '../Event/index.js';
import { EventListener, EventListenerTarget } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class GenericRawValueToNormalizedValueEventListener implements EventListener<RawValueToNormalizedValueEvent> {
  static eventListenerTarget: EventListenerTarget = EventIdentifier.RawValueToNormalizedValueEvent;
  static priority: number = 0;

  constructor() {}

  static constructFromServiceResolver(): GenericRawValueToNormalizedValueEventListener {
    return new GenericRawValueToNormalizedValueEventListener();
  }

  onEvent(event: RawValueToNormalizedValueEvent): void {
    if (event.getIdentifier() !== GenericRawValueToNormalizedValueEventListener.eventListenerTarget) {
      return;
    }
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
