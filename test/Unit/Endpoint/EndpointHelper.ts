import {
  ApiConfiguration,
  CollectionParser,
  ElementParser,
  FetchHelper,
  ServiceResolver,
  TokenParser,
} from '../../../src/Service';
import { ServiceIdentifier } from '../../../src/Type/Enum';
import { TestLogger } from '../TestLogger';

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
  serviceResolver.setService(ServiceIdentifier.serviceElementParser, ElementParser.constructFromServiceResolver());
  serviceResolver.setService(ServiceIdentifier.serviceTokenParser, TokenParser.constructFromServiceResolver());
  serviceResolver.setService(
    ServiceIdentifier.serviceCollectionParser,
    CollectionParser.constructFromServiceResolver(serviceResolver),
  );

  serviceResolver
    .getServiceOrFail<ApiConfiguration>(ServiceIdentifier.serviceApiConfiguration)
    .setApiHost('http://mock-api');

  return serviceResolver;
}

export { buildEndpointServiceResolver };
