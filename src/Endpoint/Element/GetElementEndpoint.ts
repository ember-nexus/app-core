import { ElementParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { LoggerInterface, Node, Relation, Uuid } from '../../Type/Definition/index.js';
import { NotModifiedResponse, ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get element endpoint retrieves a single element.
 *
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

  async getElement(elementId: Uuid, etag?: string): Promise<ParsedResponse<Node | Relation> | NotModifiedResponse> {
    try {
      const url = this.fetchHelper.buildUrl(`/${elementId}`);
      this.logger.debug(`Executing HTTP GET request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultGetOptions(etag)).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      if (response.status === 304) {
        return { response: response } as NotModifiedResponse;
      }

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const element = this.elementParser.deserializeElement(rawData);

      return {
        data: element,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { GetElementEndpoint };
