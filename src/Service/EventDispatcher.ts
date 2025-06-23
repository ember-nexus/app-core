import { Logger } from './Logger.js';
import { ServiceResolver } from './ServiceResolver.js';
import {
  EventDispatcherInterface,
  EventInterface,
  EventListener,
  EventListenerTarget,
  LoggerInterface,
  getEventListenerTargetsFromEventIdentifier,
} from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

type EventDispatcherEntry = {
  priority: number;
  eventListener: EventListener;
};

class EventDispatcher implements EventDispatcherInterface {
  static identifier: ServiceIdentifier = ServiceIdentifier.eventDispatcher;

  private eventListenerTargets: Map<EventListenerTarget, EventDispatcherEntry[]>;

  public constructor(private logger: LoggerInterface) {
    this.eventListenerTargets = new Map();
  }

  static constructFromServiceResolver(serviceResolver: ServiceResolver): EventDispatcher {
    const logger = serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger);
    return new EventDispatcher(logger);
  }

  async dispatchEvent(event: EventInterface): Promise<void> {
    this.logger.debug(`Dispatching event of identifier ${event.getIdentifier()}.`, { event: event });
    if (event.isPropagationStopped()) {
      this.logger.debug(`Stopped event propagation because it is already stopped.`, { event: event });
      return undefined;
    }
    const eventListenerTargetsToNotify = getEventListenerTargetsFromEventIdentifier(event.getIdentifier());
    for (let i = 0; i < eventListenerTargetsToNotify.length; ++i) {
      const eventListenerTarget = eventListenerTargetsToNotify[i];
      const eventListeners = this.eventListenerTargets.get(eventListenerTarget);
      if (eventListeners === undefined) {
        continue;
      }
      this.logger.debug(`Iterating over resolved event listeners of identifier ${eventListenerTarget}`, {
        event: event,
      });
      for (let j = eventListeners.length - 1; j >= 0; j--) {
        try {
          await Promise.resolve(eventListeners[j].eventListener.onEvent(event));
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

  addListener(eventListenerTarget: EventListenerTarget, eventListener: EventListener, priority?: number): this {
    if (priority === undefined) {
      priority = 0;
    }

    let eventListeners: EventDispatcherEntry[];
    if (!this.eventListenerTargets.has(eventListenerTarget)) {
      eventListeners = [];
    } else {
      eventListeners = this.eventListenerTargets.get(eventListenerTarget)!;
    }

    // find correct index in list to add entry to
    let left = 0;
    let right = eventListeners.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (eventListeners[mid].priority >= priority) {
        result = mid; // Found a candidate, but keep searching in the left half
        right = mid - 1;
      } else {
        left = mid + 1; // Search in the right half
      }
    }

    const insertAt = result === -1 ? left : result;

    eventListeners.splice(insertAt, 0, { priority: priority, eventListener: eventListener });
    this.eventListenerTargets.set(eventListenerTarget, eventListeners);
    return this;
  }

  removeListener(eventListenerTarget: EventListenerTarget, eventListener: EventListener): this {
    const eventListeners = this.eventListenerTargets.get(eventListenerTarget);
    if (!eventListeners) {
      return this;
    }
    for (let i = 0; i < eventListeners.length; ++i) {
      if (eventListeners[i].eventListener === eventListener) {
        eventListeners.splice(i, 1);
        break;
      }
    }
    if (eventListeners.length === 0) {
      this.eventListenerTargets.delete(eventListenerTarget);
    }
    return this;
  }

  getListeners(eventListenerTarget: EventListenerTarget): EventListener[] {
    const eventListeners = this.eventListenerTargets.get(eventListenerTarget);
    return eventListeners ? eventListeners.map((entry) => entry.eventListener) : [];
  }

  hasListeners(eventListenerTarget: EventListenerTarget): boolean {
    return this.eventListenerTargets.has(eventListenerTarget);
  }
}

export { EventDispatcher };
