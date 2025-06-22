import { Event } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class RawValueToNormalizedValueEvent extends Event {
  static identifier: EventIdentifier = EventIdentifier.RawValueToNormalizedValueEvent;

  private normalizedValue: unknown = null;

  constructor(private rawValue: unknown) {
    super(RawValueToNormalizedValueEvent.identifier);
  }

  getRawValue(): unknown {
    return this.rawValue;
  }

  getNormalizedValue(): unknown {
    return this.normalizedValue;
  }

  setNormalizedValue(normalizedValue: unknown): this {
    if (this.isPropagationStopped()) return this;
    this.normalizedValue = normalizedValue;
    return this;
  }
}

export { RawValueToNormalizedValueEvent };
