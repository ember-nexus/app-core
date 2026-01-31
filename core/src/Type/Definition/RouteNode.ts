import { RouteIdentifier } from './RouteIdentifier.js';

class RouteNode {
  private childRouteNodes: Record<string, RouteNode> = {};
  private routeHandler: RouteIdentifier[] = [];

  getChildRouteNode(segment: string): RouteNode {
    if (!(segment in this.childRouteNodes)) {
      this.childRouteNodes[segment] = new RouteNode();
    }
    return this.childRouteNodes[segment];
  }

  hasChildRouteNode(segment: string): boolean {
    return segment in this.childRouteNodes;
  }

  addRouteHandler(routeHandler: RouteIdentifier): RouteNode {
    if (!this.routeHandler.includes(routeHandler)) {
      this.routeHandler.push(routeHandler);
    }
    return this;
  }

  getRouteHandlers(): RouteIdentifier[] {
    return this.routeHandler;
  }
}

export { RouteNode };
