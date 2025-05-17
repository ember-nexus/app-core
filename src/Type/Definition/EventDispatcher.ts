import { EventInterface } from './Event.js';
import { EventListener } from './EventListener.js';
import { EventListenerIdentifier } from './EventListenerIdentifier.js';

interface EventDispatcherInterface {
  dispatchEvent(event: EventInterface): Promise<void>;
  addListener(eventListenerIdentifier: EventListenerIdentifier, eventListener: EventListener, priority?: number): this;
  removeListener(eventListenerIdentifier: EventListenerIdentifier, eventListener: EventListener): this;
  getListeners(eventListenerIdentifier: EventListenerIdentifier): EventListener[];
  hasListeners(eventListenerIdentifier: EventListenerIdentifier): boolean;
}

export { EventDispatcherInterface };
