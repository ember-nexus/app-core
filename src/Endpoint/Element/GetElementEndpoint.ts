import { LoggerInterface } from '@ember-nexus/web-sdk/Type/Definition';

import { ElementParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Node, Relation, Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get element endpoint retrieves a single element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=getelementendpoint)
 * @see [Ember Nexus API: Get Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-element)
 */
class GetElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementGetElementEndpoint;

  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
    private elementParser: ElementParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetElementEndpoint {
    return new GetElementEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser),
    );
  }

  getElement(elementId: Uuid): Promise<Node | Relation> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/${elementId}`);
        this.logger.debug(`Executing HTTP GET request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultGetOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseJsonResponse(response))
      .then((json) => this.elementParser.deserializeElement(json))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { GetElementEndpoint };
