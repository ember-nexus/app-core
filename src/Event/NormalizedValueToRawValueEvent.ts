import { Event } from '../Type/Definition/index.js';
import { EventIdentifier } from '../Type/Enum/index.js';

class NormalizedValueToRawValueEvent extends Event {
  static identifier: EventIdentifier = EventIdentifier.NormalizedValueToRawValueEvent;

  private rawValue: unknown = null;

  constructor(private normalizedValue: unknown) {
    super(NormalizedValueToRawValueEvent.identifier);
  }

  getNormalizedValue(): unknown {
    return this.normalizedValue;
  }

  getRawValue(): unknown {
    return this.rawValue;
  }

  setRawValue(rawValue: unknown): this {
    if (this.isPropagationStopped()) return this;
    this.rawValue = rawValue;
    return this;
  }
}

export { NormalizedValueToRawValueEvent };
