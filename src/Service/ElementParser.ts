import { EventDispatcher } from './EventDispatcher.js';
import { ServiceResolver } from './ServiceResolver.js';
import { RawValueToNormalizedValueEvent } from '../Event/index.js';
import { Node, Relation, validateUuidFromString } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class ElementParser {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceElementParser;
  constructor(private eventDispatcher: EventDispatcher) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): ElementParser {
    const elementDispatcher = serviceResolver.getServiceOrFail<EventDispatcher>(
      ServiceIdentifier.serviceEventDispatcher,
    );
    return new ElementParser(elementDispatcher);
  }

  async deserializeElement(element: object): Promise<Node | Relation> {
    if (!('id' in element)) {
      throw new Error("Raw element must contain property 'id' in order to be parsed to a node or relation.");
    }
    const id = validateUuidFromString(String(element.id));
    if (!('type' in element)) {
      throw new Error("Raw element must contain property 'type' in order to be parsed to a node or relation.");
    }
    const type = String(element.type);
    if (!('data' in element)) {
      throw new Error("Raw element must contain property 'data' in order to be parsed to a node or relation.");
    }
    const data = element.data as Record<string, unknown>;

    for (const key in data) {
      const rawValueToNormalizedValueEevent = new RawValueToNormalizedValueEvent(data[key]);
      await this.eventDispatcher.dispatchEvent(rawValueToNormalizedValueEevent);
      if (!rawValueToNormalizedValueEevent.isPropagationStopped()) {
        throw new Error(`Unable to deserialize property "${key}".`);
      }
      data[key] = rawValueToNormalizedValueEevent.getNormalizedValue();
    }

    if ('start' in element && 'end' in element) {
      const start = validateUuidFromString(String(element.start));
      const end = validateUuidFromString(String(element.end));
      return {
        id: id,
        start: start,
        end: end,
        type: type,
        data: data,
      } as Relation;
    }
    return {
      id: id,
      type: type,
      data: data,
    } as Node;
  }
}

export { ElementParser };
