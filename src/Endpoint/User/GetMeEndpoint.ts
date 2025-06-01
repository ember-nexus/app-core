import { LogicError } from '../../Error/index.js';
import { ElementParser, FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Element, Node } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get me endpoint retrieves the current user's element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/user?id=getmeendpoint)
 * @see [Ember Nexus API: Get Me Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/get-me)
 */
class GetMeEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserGetMeEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
    private elementParser: ElementParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetMeEndpoint {
    return new GetMeEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser),
    );
  }

  getMe(): Promise<Node> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/me`);
        this.logger.debug(`Executing HTTP GET request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultGetOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseJsonResponse(response))
      .then((json) => this.elementParser.deserializeElement(json))
      .then((element) => this.validateElementIsUserNode(element))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }

  validateElementIsUserNode(element: Element): Element {
    if (element.type !== 'User') {
      throw new LogicError("Expected node to be of type 'User'.");
    }
    return element;
  }
}

export { GetMeEndpoint };
