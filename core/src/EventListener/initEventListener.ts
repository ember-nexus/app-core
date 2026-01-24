import { DateTimeNormalizedValueToRawValueEventListener } from './DateTimeNormalizedValueToRawValueEventListener.js';
import { DateTimeRawValueToNormalizedValueEventListener } from './DateTimeRawValueToNormalizedValueEventListener.js';
import { GenericNormalizedValueToRawValueEventListener } from './GenericNormalizedValueToRawValueEventListener.js';
import { GenericRawValueToNormalizedValueEventListener } from './GenericRawValueToNormalizedValueEventListener.js';
import { EventDispatcher, ServiceResolver } from '../Service/index.js';

function initEventListener(serviceResolver: ServiceResolver): void {
  const eventDispatcher = serviceResolver.getServiceOrFail<EventDispatcher>(EventDispatcher.identifier);
  const eventListeners = [
    DateTimeNormalizedValueToRawValueEventListener,
    DateTimeRawValueToNormalizedValueEventListener,
    GenericNormalizedValueToRawValueEventListener,
    GenericRawValueToNormalizedValueEventListener,
  ];
  for (let i = 0; i < eventListeners.length; i++) {
    eventDispatcher.addListener(
      eventListeners[i].eventListenerTarget,
      eventListeners[i].constructFromServiceResolver(),
      eventListeners[i].priority,
    );
  }
}

export { initEventListener };
