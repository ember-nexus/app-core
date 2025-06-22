import { Logger } from 'tslog';

import { GetServiceResolverEvent } from './BrowserEvent/index.js';
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
import {
  DeleteTokenEndpoint,
  GetMeEndpoint,
  GetTokenEndpoint,
  PostChangePasswordEndpoint,
  PostRegisterEndpoint,
  PostTokenEndpoint,
} from './Endpoint/User/index.js';
import {
  ApiConfiguration,
  ApiWrapper,
  CollectionParser,
  ElementParser,
  EventDispatcher,
  FetchHelper,
  ServiceResolver,
  TokenParser,
} from './Service/index.js';
import { PriorityRegistry, Registry } from './Type/Definition/index.js';
import { EventIdentifier, ServiceIdentifier } from './Type/Enum/index.js';

function init(rootNode: HTMLElement): ServiceResolver {
  const serviceResolver = new ServiceResolver();

  rootNode.addEventListener(EventIdentifier.GetServiceResolver, (event: GetServiceResolverEvent) => {
    event.setServiceResolver(serviceResolver);
    event.stopPropagation();
  });

  serviceResolver.setService(ServiceIdentifier.action, new PriorityRegistry());

  serviceResolver.setService(ServiceIdentifier.setting, new Registry());

  serviceResolver.setService(ServiceIdentifier.icon, new Registry());

  const logger = new Logger({
    name: 'app-core',
    type: 'pretty',
  });
  serviceResolver.setService(ServiceIdentifier.logger, logger);

  const eventDispatcher = new EventDispatcher(logger);
  serviceResolver.setService(ServiceIdentifier.eventDispatcher, eventDispatcher);

  const services = [
    // services
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

  return serviceResolver;
}

export { init };
