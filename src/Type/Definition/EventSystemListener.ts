import { StoppableEvent } from './StoppableEvent.js';

interface EventSystemListener<EventType extends StoppableEvent> {
  triggerOnEvent(event: EventType): void;
}

export { EventSystemListener };
