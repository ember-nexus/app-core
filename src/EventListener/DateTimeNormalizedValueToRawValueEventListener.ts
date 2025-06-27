import { DateTime } from 'luxon';

import { NormalizedValueToRawValueEvent } from '../Event/index.js';
import { EventListener, EventListenerTarget } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class DateTimeNormalizedValueToRawValueEventListener implements EventListener<NormalizedValueToRawValueEvent> {
  static eventListenerTarget: EventListenerTarget = EventIdentifier.NormalizedValueToRawValueEvent;
  static priority: number = 50;

  constructor() {}

  static constructFromServiceResolver(): DateTimeNormalizedValueToRawValueEventListener {
    return new DateTimeNormalizedValueToRawValueEventListener();
  }

  onEvent(event: NormalizedValueToRawValueEvent): void {
    if (event.getIdentifier() !== DateTimeNormalizedValueToRawValueEventListener.eventListenerTarget) {
      return;
    }
    const normalizedValue = event.getNormalizedValue();
    if (!(normalizedValue instanceof Date)) {
      return;
    }
    const rawValue = DateTime.fromJSDate(normalizedValue).toFormat("yyyy-MM-dd'T'HH:mm:ssZZ");
    event.setRawValue(rawValue);
    event.stopPropagation();
  }
}

export { DateTimeNormalizedValueToRawValueEventListener };
