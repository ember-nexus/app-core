import { EventManager } from '../EventManager.js';
import { RawValueToNormalizedValueEvent } from './Event/index.js';
import {
  DateTimeRawValueToNormalizedValueEventListener,
  GenericRawValueToNormalizedValueEventListener,
} from './EventListener/index.js';

class RawValueToNormalizedValueEventManager extends EventManager<RawValueToNormalizedValueEvent> {
  constructor(
    dateTimeRawValueToNormalizedValueEventListener: DateTimeRawValueToNormalizedValueEventListener,
    genericRawValueToNormalizedValueEventListener: GenericRawValueToNormalizedValueEventListener,
  ) {
    super();
    this.registerEventListener(genericRawValueToNormalizedValueEventListener, 0);
    this.registerEventListener(dateTimeRawValueToNormalizedValueEventListener, 1);
  }
}

export { RawValueToNormalizedValueEventManager };
