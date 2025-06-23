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
  DateTimeNormalizedValueToRawValueEventListener,
  DateTimeRawValueToNormalizedValueEventListener,
  GenericNormalizedValueToRawValueEventListener,
  GenericRawValueToNormalizedValueEventListener,
} from './EventListener/index.js';
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
import { BrowserEventIdentifier, ServiceIdentifier } from './Type/Enum/index.js';

function init(rootNode: HTMLElement): ServiceResolver {
  const serviceResolver = new ServiceResolver();

  rootNode.addEventListener(BrowserEventIdentifier.GetServiceResolver, (event: GetServiceResolverEvent) => {
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
    EventDispatcher,
    ApiWrapper,
  ];
  for (let i = 0; i < services.length; i++) {
    serviceResolver.setService(services[i].identifier, services[i].constructFromServiceResolver(serviceResolver));
  }

  // event listeners
  const eventListeners = [
    DateTimeNormalizedValueToRawValueEventListener,
    DateTimeRawValueToNormalizedValueEventListener,
    GenericNormalizedValueToRawValueEventListener,
    GenericRawValueToNormalizedValueEventListener,
  ];
  const eventDispatcher = serviceResolver.getServiceOrFail<EventDispatcher>(EventDispatcher.identifier);
  for (let i = 0; i < eventListeners.length; i++) {
    eventDispatcher.addListener(
      eventListeners[i].eventListenerTarget,
      eventListeners[i].constructFromServiceResolver(),
      eventListeners[i].priority,
    );
  }

  return serviceResolver;
}

export { init };
