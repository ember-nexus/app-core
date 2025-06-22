import { EventIdentifier } from './EventIdentifier.js';

interface EventInterface {
  getIdentifier(): EventIdentifier;

  isPropagationStopped(): boolean;
  stopPropagation(): this;
}

abstract class Event implements EventInterface {
  private readonly identifier: EventIdentifier;
  private stopped: boolean = false;

  protected constructor(identifier: EventIdentifier) {
    this.identifier = identifier;
  }

  getIdentifier(): EventIdentifier {
    return this.identifier;
  }

  isPropagationStopped(): boolean {
    return this.stopped;
  }

  stopPropagation(): this {
    this.stopped = true;
    return this;
  }
}

export { EventInterface, Event };
