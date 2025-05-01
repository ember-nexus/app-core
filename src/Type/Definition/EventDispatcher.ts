import {EventInterface} from "./Event";

// todo: implement similar logic as in https://github.com/simshaun/ts-event-dispatcher/blob/master/src/index.ts
interface EventDispatcher {
  dispatchEvent(event: EventInterface): this;
}

export {EventDispatcher};
