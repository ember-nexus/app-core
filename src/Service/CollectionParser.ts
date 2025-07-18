import { ElementParser } from './ElementParser.js';
import { ServiceResolver } from './ServiceResolver.js';
import { Collection, Node, Relation } from '../Type/Definition/index.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

/**
 * Class which helps to parse collections.
 */
class CollectionParser {
  static identifier: ServiceIdentifier = ServiceIdentifier.serviceCollectionParser;
  constructor(private elementParser: ElementParser) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): CollectionParser {
    const elementParser = serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser);
    return new CollectionParser(elementParser);
  }

  async deserializeCollection(rawCollection: object): Promise<Collection> {
    if (!('id' in rawCollection)) {
      throw new Error("Raw collection must contain property 'id' in order to be parsed to a collection.");
    }
    const id = String(rawCollection.id);

    if (!('totalNodes' in rawCollection)) {
      throw new Error("Raw collection must contain property 'totalNodes' in order to be parsed to a collection.");
    }
    const totalNodes = Number(rawCollection.totalNodes);

    if (!('links' in rawCollection)) {
      throw new Error("Raw collection must contain property 'links' in order to be parsed to a collection.");
    }
    if (typeof rawCollection.links !== 'object' || rawCollection.links === null) {
      throw new Error('Links property in raw collection must be of type object.');
    }
    const rawCollectionLinks = rawCollection.links as object;

    if (!('first' in rawCollectionLinks)) {
      throw new Error("Raw collection must contain property 'links.first' in order to be parsed to a collection.");
    }
    const first = String(rawCollectionLinks.first);

    if (!('previous' in rawCollectionLinks)) {
      throw new Error("Raw collection must contain property 'links.previous' in order to be parsed to a collection.");
    }
    const previous = rawCollectionLinks.previous === null ? null : String(rawCollectionLinks.previous);

    if (!('next' in rawCollectionLinks)) {
      throw new Error("Raw collection must contain property 'links.next' in order to be parsed to a collection.");
    }
    const next = rawCollectionLinks.next === null ? null : String(rawCollectionLinks.next);

    if (!('last' in rawCollectionLinks)) {
      throw new Error("Raw collection must contain property 'links.last' in order to be parsed to a collection.");
    }
    const last = String(rawCollectionLinks.last);

    if (!('nodes' in rawCollection)) {
      throw new Error("Raw collection must contain property 'nodes' in order to be parsed to a collection.");
    }
    if (!Array.isArray(rawCollection.nodes)) {
      throw new Error('Nodes property in raw collection must be of type array.');
    }
    const nodes: Array<Node> = [];
    for (const rawNode of rawCollection.nodes) {
      nodes.push((await this.elementParser.deserializeElement(rawNode)) as Node);
    }

    if (!('relations' in rawCollection)) {
      throw new Error("Raw collection must contain property 'relations' in order to be parsed to a collection.");
    }
    if (!Array.isArray(rawCollection.relations)) {
      throw new Error('Relations property in raw collection must be of type array.');
    }
    const relations: Array<Relation> = [];
    for (const rawRelation of rawCollection.relations) {
      relations.push((await this.elementParser.deserializeElement(rawRelation)) as Relation);
    }

    return {
      id: id,
      totalNodes: totalNodes,
      links: {
        first: first,
        previous: previous,
        next: next,
        last: last,
      },
      nodes: nodes,
      relations: relations,
    };
  }
}

export { CollectionParser };
