import { DateTime } from 'luxon';

import { EventSystemListener } from '../../../Type/Definition/index.js';
import { NormalizedValueToRawValueEvent } from '../Event/index.js';

class DateTimeNormalizedValueToRawValueEventListener implements EventSystemListener<NormalizedValueToRawValueEvent> {
  triggerOnEvent(event: NormalizedValueToRawValueEvent): void {
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
