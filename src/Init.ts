import { EmberNexus } from '@ember-nexus/web-sdk/Service';
import { Logger } from 'tslog';

import { GetServiceResolverEvent } from './BrowserEvent/index.js';
import { ServiceResolver } from './Service/index.js';
import { EventDispatcher } from './Service/index.js';
import { PriorityRegistry, Registry, validateServiceIdentifierFromString } from './Type/Definition/index.js';
import { EventIdentifier } from './Type/Enum/index.js';
import { ServiceIdentifier } from './Type/Enum/ServiceIdentifier.js';

function init(rootNode: HTMLElement, emberNexus: EmberNexus | null = null): ServiceResolver {
  const serviceResolver = new ServiceResolver();

  rootNode.addEventListener(EventIdentifier.GetServiceResolver, (event: GetServiceResolverEvent) => {
    event.setServiceResolver(serviceResolver);
    event.stopPropagation();
  });

  if (emberNexus === null) {
    emberNexus = new EmberNexus();
  }
  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.emberNexusWebSDK), emberNexus);

  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.action), new PriorityRegistry());

  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.setting), new Registry());

  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.icon), new Registry());

  const logger = new Logger({
    name: 'app-core',
    type: 'pretty',
  });
  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.logger), logger);

  const eventDispatcher = new EventDispatcher(logger);
  serviceResolver.setService(validateServiceIdentifierFromString(ServiceIdentifier.eventDispatcher), eventDispatcher);

  return serviceResolver;
}

export { init };
