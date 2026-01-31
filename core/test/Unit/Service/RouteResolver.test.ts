import { expect, test } from 'vitest';

import { RouteResolver } from '../../../src/Service/index.js';
import { PluginIdentifier, RouteConfiguration, RouteIdentifier } from '../../../src/Type/Definition/index.js';

function buildRouteConfiguration(
  routeIdentifier: string,
  route: string,
  priority: number = 1,
  guardResult: boolean = true,
): RouteConfiguration {
  return {
    pluginIdentifier: 'test' as PluginIdentifier,
    routeIdentifier: routeIdentifier as RouteIdentifier,
    route: route,
    priority: priority,
    webComponent: 'ember-nexus-test-page',
    // eslint-disable-next-line require-await
    guard: async (): Promise<boolean> => {
      return guardResult;
    },
  };
}

test('unconfigured route resolver can not resolve index route', async () => {
  const routeResolver = new RouteResolver();

  expect(await routeResolver.findRouteConfiguration('/')).toBeNull();
});

test('configured route resolver can resolve index route', async () => {
  const routeConfiguration = buildRouteConfiguration('test-route', '/');

  const routeResolver = new RouteResolver().addRouteConfiguration(routeConfiguration);

  expect(await routeResolver.findRouteConfiguration('/')).toEqual(routeConfiguration);
});

test('configured route resolver can resolve index route (2)', async () => {
  const routeConfiguration = buildRouteConfiguration('test-route', '/');

  const routeResolver = new RouteResolver().addRouteConfiguration(routeConfiguration);

  expect(await routeResolver.findRouteConfiguration('')).toEqual(routeConfiguration);
});

test('priority of configured routes is respected', async () => {
  const routeConfiguration1 = buildRouteConfiguration('test-route-1', '/', 1);
  const routeConfiguration2 = buildRouteConfiguration('test-route-2', '/', 2);
  const routeConfiguration3 = buildRouteConfiguration('test-route-3', '/', 3);

  const routeResolver = new RouteResolver()
    .addRouteConfiguration(routeConfiguration2)
    .addRouteConfiguration(routeConfiguration3)
    .addRouteConfiguration(routeConfiguration1);

  expect(await routeResolver.findRouteConfiguration('/')).toEqual(routeConfiguration3);
});

test('on identical priority and route, definition order is respected', async () => {
  const routeConfiguration1 = buildRouteConfiguration('test-route-1', '/');
  const routeConfiguration2 = buildRouteConfiguration('test-route-2', '/');
  const routeConfiguration3 = buildRouteConfiguration('test-route-3', '/');

  const routeResolver = new RouteResolver()
    .addRouteConfiguration(routeConfiguration2)
    .addRouteConfiguration(routeConfiguration3)
    .addRouteConfiguration(routeConfiguration1);

  expect(await routeResolver.findRouteConfiguration('/')).toEqual(routeConfiguration2);
});

test('on identical priority, exact matches are prefered over wildcards', async () => {
  const routeConfiguration1 = buildRouteConfiguration('test-route-1', '/test/*/b');
  const routeConfiguration2 = buildRouteConfiguration('test-route-2', '/test/a/b');
  const routeConfiguration3 = buildRouteConfiguration('test-route-3', '/test/*/b');

  const routeResolver = new RouteResolver()
    .addRouteConfiguration(routeConfiguration1)
    .addRouteConfiguration(routeConfiguration2)
    .addRouteConfiguration(routeConfiguration3);

  expect(await routeResolver.findRouteConfiguration('/test/a/b')).toEqual(routeConfiguration2);
});

test('on identical priority, longer exact prefixes are preferred', async () => {
  const routeConfiguration1 = buildRouteConfiguration('test-route-1', '/test/*/b');
  const routeConfiguration2 = buildRouteConfiguration('test-route-2', '/test/a/*');
  const routeConfiguration3 = buildRouteConfiguration('test-route-3', '/test/*/b');

  const routeResolver = new RouteResolver()
    .addRouteConfiguration(routeConfiguration1)
    .addRouteConfiguration(routeConfiguration2)
    .addRouteConfiguration(routeConfiguration3);

  expect(await routeResolver.findRouteConfiguration('/test/a/b')).toEqual(routeConfiguration2);
});

test('routes whose guards return false are skipped', async () => {
  const routeConfiguration1 = buildRouteConfiguration('test-route-1', '/test/a/b', 1, false);
  const routeConfiguration2 = buildRouteConfiguration('test-route-2', '/test/a/b', 1, true);
  const routeConfiguration3 = buildRouteConfiguration('test-route-3', '/test/a/b', 1, false);

  const routeResolver = new RouteResolver()
    .addRouteConfiguration(routeConfiguration1)
    .addRouteConfiguration(routeConfiguration2)
    .addRouteConfiguration(routeConfiguration3);

  expect(await routeResolver.findRouteConfiguration('/test/a/b')).toEqual(routeConfiguration2);
});
