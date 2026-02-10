import { Logger } from 'tslog';

import {
  ElementCache,
  ElementChildrenCache,
  ElementParentsCache,
  ElementRelatedCache,
  IndexCache,
} from './Cache/index.js';
import {
  DeleteElementEndpoint,
  GetElementChildrenEndpoint,
  GetElementEndpoint,
  GetElementParentsEndpoint,
  GetElementRelatedEndpoint,
  GetIndexEndpoint,
  PatchElementEndpoint,
  PostElementEndpoint,
  PostIndexEndpoint,
  PutElementEndpoint,
} from './Endpoint/Element/index.js';
import { PostSearchEndpoint } from './Endpoint/Search/PostSearchEndpoint.js';
import {
  DeleteTokenEndpoint,
  GetMeEndpoint,
  GetTokenEndpoint,
  PostChangePasswordEndpoint,
  PostRegisterEndpoint,
  PostTokenEndpoint,
} from './Endpoint/User/index.js';
import { initEventListener } from './EventListener/index.js';
import {
  ApiConfiguration,
  ApiWrapper,
  CollectionParser,
  ElementParser,
  EventDispatcher,
  FetchHelper,
  RouteResolver,
  ServiceResolver,
  TokenParser,
} from './Service/index.js';
import { PriorityRegistry, Registry, pluginInit } from './Type/Definition/index.js';
import { ServiceIdentifier } from './Type/Enum/index.js';

const init: pluginInit = (serviceResolver: ServiceResolver) => {
  serviceResolver.setService(ServiceIdentifier.action, new PriorityRegistry());
  serviceResolver.setService(ServiceIdentifier.setting, new Registry());
  serviceResolver.setService(ServiceIdentifier.icon, new Registry());
  serviceResolver.setService(ServiceIdentifier.routeResolver, new RouteResolver());

  const logger = new Logger({
    name: 'app-core',
    type: 'pretty',
  });
  serviceResolver.setService(ServiceIdentifier.logger, logger);

  const services = [
    // services
    EventDispatcher,
    ElementParser,
    CollectionParser,
    TokenParser,
    ApiConfiguration,
    FetchHelper,

    // element endpoints
    DeleteElementEndpoint,
    GetElementEndpoint,
    GetElementChildrenEndpoint,
    GetElementParentsEndpoint,
    GetElementRelatedEndpoint,
    GetIndexEndpoint,
    PatchElementEndpoint,
    PostElementEndpoint,
    PostIndexEndpoint,
    PutElementEndpoint,

    // user endpoints
    DeleteTokenEndpoint,
    GetMeEndpoint,
    GetTokenEndpoint,
    PostChangePasswordEndpoint,
    PostRegisterEndpoint,
    PostTokenEndpoint,

    // search endpoints
    PostSearchEndpoint,

    // caches
    ElementCache,
    ElementChildrenCache,
    ElementParentsCache,
    ElementRelatedCache,
    IndexCache,

    // high level services
    ApiWrapper,
  ];
  for (let i = 0; i < services.length; i++) {
    serviceResolver.setService(services[i].identifier, services[i].constructFromServiceResolver(serviceResolver));
  }

  // event listeners
  initEventListener(serviceResolver);

  return Promise.resolve();
};

export { init };
