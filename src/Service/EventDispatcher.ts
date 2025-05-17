import {
  EventDispatcherInterface,
  EventInterface,
  EventListener,
  EventListenerIdentifier,
  LoggerInterface,
  getEventListenerIdentifiersFromEventIdentifier,
} from '../Type/Definition/index.js';

type EventDispatcherEntry = {
  priority: number;
  eventListener: EventListener;
};

class EventDispatcher implements EventDispatcherInterface {
  private readonly entries: Map<string, EventDispatcherEntry[]> = new Map();
  private logger: LoggerInterface;

  public constructor(logger: LoggerInterface) {
    this.logger = logger;
  }

  async dispatchEvent(event: EventInterface): Promise<void> {
    this.logger.debug(`Dispatching event of identifier ${event.getIdentifier()}.`, { event: event });
    if (event.isPropagationStopped()) {
      this.logger.debug(`Stopped event propagation because it is already stopped.`, { event: event });
      return undefined;
    }
    const eventListenerIdentifiersToNotify = getEventListenerIdentifiersFromEventIdentifier(event.getIdentifier());
    for (let i = 0; i < eventListenerIdentifiersToNotify.length; ++i) {
      const eventListenerIdentifier = eventListenerIdentifiersToNotify[i];
      const eventListeners = this.entries.get(eventListenerIdentifier);
      if (eventListeners === undefined) {
        continue;
      }
      this.logger.debug(`Iterating over resolved event listeners of identifier ${eventListenerIdentifier}`, {
        event: event,
      });
      for (let j = eventListeners.length - 1; j >= 0; j--) {
        try {
          await Promise.resolve(eventListeners[j].eventListener(event));
        } catch (e: unknown) {
          this.logger.error(`Event handler threw exception, dispatcher continues with next event listener.`, {
            event: event,
            error: e,
          });
        }
        if (event.isPropagationStopped()) {
          this.logger.debug(`Stopped event propagation as it got stopped.`, { event: event });
          return undefined;
        }
      }
    }
    this.logger.debug(`Event got handled by all event listeners.`, { event: event });
    return undefined;
  }

  addListener(eventListenerIdentifier: EventListenerIdentifier, eventListener: EventListener, priority?: number): this {
    if (priority === undefined) {
      priority = 0;
    }

    let eventListenersList: EventDispatcherEntry[];
    if (!this.entries.has(eventListenerIdentifier)) {
      eventListenersList = [];
    } else {
      eventListenersList = this.entries.get(eventListenerIdentifier)!;
    }

    // find correct index in list to add entry to
    let left = 0;
    let right = eventListenersList.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (eventListenersList[mid].priority >= priority) {
        result = mid; // Found a candidate, but keep searching in the left half
        right = mid - 1;
      } else {
        left = mid + 1; // Search in the right half
      }
    }

    const insertAt = result === -1 ? left : result;

    eventListenersList.splice(insertAt, 0, { priority: priority, eventListener: eventListener });
    this.entries.set(eventListenerIdentifier, eventListenersList);
    return this;
  }

  removeListener(eventListenerIdentifier: EventListenerIdentifier, eventListener: EventListener): this {
    const eventListenersList = this.entries.get(eventListenerIdentifier);
    if (!eventListenersList) {
      return this;
    }
    for (let i = 0; i < eventListenersList.length; ++i) {
      if (eventListenersList[i].eventListener === eventListener) {
        eventListenersList.splice(i, 1);
        break;
      }
    }
    if (eventListenersList.length === 0) {
      this.entries.delete(eventListenerIdentifier);
    }
    return this;
  }

  getListeners(eventListenerIdentifier: EventListenerIdentifier): EventListener[] {
    const entries = this.entries.get(eventListenerIdentifier);
    return entries ? entries.map((entry) => entry.eventListener) : [];
  }

  hasListeners(eventListenerIdentifier: EventListenerIdentifier): boolean {
    return this.entries.has(eventListenerIdentifier);
  }
}

export { EventDispatcher };
