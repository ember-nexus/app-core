import { initEventListener } from '../../../src/EventListener/index.js';
import {
  ApiConfiguration,
  CollectionParser,
  ElementParser,
  EventDispatcher,
  FetchHelper,
  ServiceResolver,
  TokenParser,
} from '../../../src/Service/index.js';
import { ServiceIdentifier } from '../../../src/Type/Enum/index.js';
import { TestLogger } from '../TestLogger.js';

function buildEndpointServiceResolver(): ServiceResolver {
  const serviceResolver = new ServiceResolver();
  serviceResolver.setService(ServiceIdentifier.logger, new TestLogger());
  serviceResolver.setService(
    ServiceIdentifier.serviceApiConfiguration,
    ApiConfiguration.constructFromServiceResolver(serviceResolver),
  );
  serviceResolver.setService(
    ServiceIdentifier.serviceFetchHelper,
    FetchHelper.constructFromServiceResolver(serviceResolver),
  );
  serviceResolver.setService(
    ServiceIdentifier.serviceEventDispatcher,
    EventDispatcher.constructFromServiceResolver(serviceResolver),
  );
  serviceResolver.setService(
    ServiceIdentifier.serviceElementParser,
    ElementParser.constructFromServiceResolver(serviceResolver),
  );
  serviceResolver.setService(ServiceIdentifier.serviceTokenParser, TokenParser.constructFromServiceResolver());
  serviceResolver.setService(
    ServiceIdentifier.serviceCollectionParser,
    CollectionParser.constructFromServiceResolver(serviceResolver),
  );

  serviceResolver
    .getServiceOrFail<ApiConfiguration>(ServiceIdentifier.serviceApiConfiguration)
    .setApiHost('http://mock-api');

  initEventListener(serviceResolver);

  return serviceResolver;
}

export { buildEndpointServiceResolver };
