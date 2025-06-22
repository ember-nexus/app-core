import { RawValueToNormalizedValueEvent } from '../Event/index.js';
import { EventSystemListener } from '../Type/Definition/index.js';

class DateTimeRawValueToNormalizedValueEventListener implements EventSystemListener<RawValueToNormalizedValueEvent> {
  static readonly dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;

  triggerOnEvent(event: RawValueToNormalizedValueEvent): void {
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
