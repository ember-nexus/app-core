import { LogicError } from '../../Error/index.js';
import { ElementParser, FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Element, Node } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get token endpoint retrieves the current session's token element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=gettokenendpoint)
 * @see [Ember Nexus API: Get Token Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/get-token)
 */
class GetTokenEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserGetTokenEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
    private elementParser: ElementParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetTokenEndpoint {
    return new GetTokenEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser),
    );
  }

  getToken(): Promise<Node> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/token`);
        this.logger.debug(`Executing HTTP GET request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultGetOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseJsonResponse(response))
      .then((json) => this.elementParser.deserializeElement(json))
      .then((element) => this.validateElementIsTokenNode(element))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }

  validateElementIsTokenNode(element: Element): Element {
    if (element.type !== 'Token') {
      throw new LogicError("Expected node to be of type 'Token'.");
    }
    return element;
  }
}

export { GetTokenEndpoint };
