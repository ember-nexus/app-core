import { EmberNexus } from '@ember-nexus/web-sdk/Service';
import { Logger } from 'tslog';

import { GetServiceResolverEvent } from './BrowserEvent/index.js';
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
import { EventDispatcher, ServiceResolver } from './Service/index.js';
import { PriorityRegistry, Registry } from './Type/Definition/index.js';
import { EventIdentifier, ServiceIdentifier } from './Type/Enum/index.js';

function init(rootNode: HTMLElement, emberNexus: EmberNexus | null = null): ServiceResolver {
  const serviceResolver = new ServiceResolver();

  rootNode.addEventListener(EventIdentifier.GetServiceResolver, (event: GetServiceResolverEvent) => {
    event.setServiceResolver(serviceResolver);
    event.stopPropagation();
  });

  if (emberNexus === null) {
    emberNexus = new EmberNexus();
  }
  serviceResolver.setService(ServiceIdentifier.emberNexusWebSDK, emberNexus);

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

  const endpoints = [
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
  ];
  for (let i = 0; i < endpoints.length; i++) {
    serviceResolver.setService(endpoints[i].identifier, endpoints[i].constructFromServiceResolver(serviceResolver));
  }

  return serviceResolver;
}

export { init };
