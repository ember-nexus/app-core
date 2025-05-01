import { EventIdentifier } from './EventIdentifier.js';

interface EventInterface {
  getIdentifier(): EventIdentifier;

  isPropagationStopped(): boolean;
  stopPropagation(): this;

  getContextValue(key: string): unknown;
  setContextValue(key: string, value: unknown): this;
  hasContextValue(key: string): boolean;
  clearContextValue(key: string): this;
  getContext(): Readonly<Record<string, unknown>>;
  setContext(context: Record<string, unknown>): this;
  clearContext(): this;
}

class Event implements EventInterface {
  private readonly identifier: EventIdentifier;
  private stopped: boolean = false;
  private context: Record<string, unknown>;

  constructor(identifier: EventIdentifier, context: Record<string, unknown> = {}) {
    this.identifier = identifier;
    this.context = context;
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

  getContextValue(key: string): unknown {
    return this.context[key];
  }

  setContextValue(key: string, value: unknown): this {
    this.context[key] = value;
    return this;
  }

  hasContextValue(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.context, key);
  }

  clearContextValue(key: string): this {
    delete this.context[key];
    return this;
  }

  getContext(): Readonly<Record<string, unknown>> {
    return { ...this.context };
  }

  setContext(context: Record<string, unknown>): this {
    this.context = context;
    return this;
  }

  clearContext(): this {
    this.context = {};
    return this;
  }
}

export { EventInterface, Event };
