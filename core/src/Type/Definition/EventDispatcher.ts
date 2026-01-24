import { EventInterface } from './Event.js';
import { EventListener } from './EventListener.js';
import { EventListenerTarget } from './EventListenerTarget.js';

interface EventDispatcherInterface {
  dispatchEvent(event: EventInterface): Promise<void>;
  addListener(eventListenerIdentifier: EventListenerTarget, eventListener: EventListener, priority?: number): this;
  removeListener(eventListenerIdentifier: EventListenerTarget, eventListener: EventListener): this;
  getListeners(eventListenerIdentifier: EventListenerTarget): EventListener[];
  hasListeners(eventListenerIdentifier: EventListenerTarget): boolean;
}

export { EventDispatcherInterface };
