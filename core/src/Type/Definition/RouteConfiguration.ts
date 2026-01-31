import { PluginIdentifier } from './PluginIdentifier.js';
import { RouteGuardFunction } from './RouteGuardFunction.js';
import { RouteIdentifier } from './RouteIdentifier.js';
import { RouteToWebComponentFunction } from './RouteToWebComponentFunction.js';

type RouteConfiguration = {
  pluginIdentifier: PluginIdentifier;
  routeIdentifier: RouteIdentifier;
  route: string;
  priority: number;
  webComponent: string | RouteToWebComponentFunction;
  guard: RouteGuardFunction;
};

export { RouteConfiguration };
