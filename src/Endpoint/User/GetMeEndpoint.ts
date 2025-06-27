import { LogicError } from '../../Error/index.js';
import { ElementParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, Node } from '../../Type/Definition/index.js';
import { ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get me endpoint retrieves the current user's element.
 *
 * @see [Ember Nexus API: Get Me Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/user/get-me)
 */
class GetMeEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointUserGetMeEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
    private elementParser: ElementParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetMeEndpoint {
    return new GetMeEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<ElementParser>(ServiceIdentifier.serviceElementParser),
    );
  }

  async getMe(): Promise<ParsedResponse<Node>> {
    try {
      const url = this.fetchHelper.buildUrl(`/me`);
      this.logger.debug(`Executing HTTP GET request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultGetOptions()).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const element = await this.elementParser.deserializeElement(rawData);

      if (element.type !== 'User') {
        throw new LogicError("Expected node to be of type 'User'.");
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

export { GetMeEndpoint };
