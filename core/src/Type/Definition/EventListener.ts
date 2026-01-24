import { EventInterface } from './Event.js';
import { OptionalPromise } from './OptionalPromise.js';

interface EventListener<EventType extends EventInterface = EventInterface> {
  onEvent(event: EventType): OptionalPromise<void>;
}

export { EventListener };
