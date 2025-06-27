import { LogicError } from '../../Error/index.js';
import { ElementParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, Node } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get token endpoint retrieves the current session's token element.
 *
 * @see [Ember Nexus API: Get Token Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/get-token)
 */
class GetTokenEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserGetTokenEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
    private elementParser: ElementParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetTokenEndpoint {
    return new GetTokenEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser),
    );
  }

  async getToken(): Promise<ParsedResponse<Node>> {
    try {
      const url = this.fetchHelper.buildUrl(`/token`);
      this.logger.debug(`Executing HTTP GET request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultGetOptions()).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const element = await this.elementParser.deserializeElement(rawData);

      if (element.type !== 'Token') {
        throw new LogicError("Expected node to be of type 'Token'.");
      }

      return {
        data: element,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { GetTokenEndpoint };
