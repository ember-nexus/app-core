import { RawValueToNormalizedValueEvent } from '../Event/index.js';
import { EventListener, EventListenerTarget } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class DateTimeRawValueToNormalizedValueEventListener implements EventListener<RawValueToNormalizedValueEvent> {
  static eventListenerTarget: EventListenerTarget = EventIdentifier.RawValueToNormalizedValueEvent;
  static priority: number = 50;

  static readonly dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;

  constructor() {}

  static constructFromServiceResolver(): DateTimeRawValueToNormalizedValueEventListener {
    return new DateTimeRawValueToNormalizedValueEventListener();
  }

  onEvent(event: RawValueToNormalizedValueEvent): void {
    if (event.getIdentifier() !== DateTimeRawValueToNormalizedValueEventListener.eventListenerTarget) {
      return;
    }
    const rawValue = event.getRawValue();
    if (typeof rawValue !== 'string') {
      return;
    }
    if (!DateTimeRawValueToNormalizedValueEventListener.dateRegex.test(rawValue)) {
      return;
    }
    const normalizedValue = new Date(rawValue);
    event.setNormalizedValue(normalizedValue);
    event.stopPropagation();
  }
}

export { DateTimeRawValueToNormalizedValueEventListener };
