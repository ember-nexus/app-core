import { EventInterface } from './Event.js';
import { OptionalPromise } from './OptionalPromise.js';

type EventListener = (event: EventInterface) => OptionalPromise<void>;

export { EventListener };
