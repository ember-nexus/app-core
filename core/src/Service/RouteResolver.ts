import { RouteConfiguration, RouteIdentifier } from '../Type/Definition/index.js';
import { RouteNode } from '../Type/Definition/RouteNode.js';
import { ServiceIdentifier } from '../Type/Enum/index.js';

class RouteResolver {
  static identifier: ServiceIdentifier = ServiceIdentifier.routeResolver;
  //todo: add some way to replace and/or disable specific routes
  private readonly routes: Map<RouteIdentifier, RouteConfiguration> = new Map();
  private rootNode: RouteNode = new RouteNode();

  hasRouteConfiguration(routeIdentifier: RouteIdentifier): boolean {
    return this.routes.has(String(routeIdentifier));
  }

  getRouteConfiguration(routeIdentifier: RouteIdentifier): null | RouteConfiguration {
    const routeEntry = this.routes.get(String(routeIdentifier));
    if (routeEntry === undefined) {
      return null;
    }
    return routeEntry;
  }

  getRouteConfigurationOrFail(routeIdentifier: RouteIdentifier): RouteConfiguration {
    const routeEntry = this.routes.get(String(routeIdentifier));
    if (routeEntry === undefined) {
      throw new Error(`Requested route with identifier ${String(routeIdentifier)} could not be resolved.`);
    }
    return routeEntry;
  }

  private getSegmentsFromRoute(input: string): string[] {
    return input
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
  }

  addRouteConfiguration(routeConfiguration: RouteConfiguration): RouteResolver {
    this.routes.set(String(routeConfiguration.routeIdentifier), routeConfiguration);

    const segments = this.getSegmentsFromRoute(routeConfiguration.route);
    let node = this.rootNode;
    for (let i = 0; i < segments.length; i++) {
      node = node.getChildRouteNode(segments[i]);
    }
    node.addRouteHandler(routeConfiguration.routeIdentifier);

    return this;
  }

  findRouteConfigurationsByNodeAndSegments(node: RouteNode, segments: string[]): RouteIdentifier[] {
    if (segments.length === 0) {
      return node.getRouteHandlers();
    }
    const routeIdentifiers: RouteIdentifier[] = [];
    if (node.hasChildRouteNode(segments[0])) {
      routeIdentifiers.push(
        ...this.findRouteConfigurationsByNodeAndSegments(node.getChildRouteNode(segments[0]), segments.slice(1)),
      );
    }
    if (node.hasChildRouteNode('*')) {
      routeIdentifiers.push(
        ...this.findRouteConfigurationsByNodeAndSegments(node.getChildRouteNode('*'), segments.slice(1)),
      );
    }

    return routeIdentifiers;
  }

  async findRouteConfiguration(route: string): Promise<RouteConfiguration | null> {
    const segments = this.getSegmentsFromRoute(route);
    let routeIdentifiers = this.findRouteConfigurationsByNodeAndSegments(this.rootNode, segments);
    routeIdentifiers = [...new Set(routeIdentifiers)];

    const routeConfigurations: RouteConfiguration[] = routeIdentifiers
      .map((id) => this.getRouteConfiguration(id))
      .filter((config): config is RouteConfiguration => config !== null)
      .sort((a, b) => b.priority - a.priority);

    for (const config of routeConfigurations) {
      if (await config.guard(route, [], null)) {
        return config;
      }
    }

    return null;
  }

  deleteRouteConfiguration(routeIdentifier: RouteIdentifier): RouteResolver {
    // todo: add warning that deleting and re-defining identical route identifiers can lead to issues
    this.routes.delete(String(routeIdentifier));
    return this;
  }

  getRouteIdentifiers(): RouteIdentifier[] {
    return [...this.routes.keys()];
  }

  getRoutesConfigurations(): RouteConfiguration[] {
    return [...this.routes.values()];
  }

  clearRoutes(): RouteResolver {
    this.routes.clear();
    return this;
  }
}

export { RouteResolver };
