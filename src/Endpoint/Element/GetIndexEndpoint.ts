import { ValidationError } from '../../Error/index.js';
import { CollectionParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Collection, LoggerInterface } from '../../Type/Definition/index.js';
import { NotModifiedResponse, ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get index endpoint retrieves all root level nodes.
 *
 * The root-level nodes are paginated. No relations are returned, as relations always require a starting node and can
 * therefore never be root-level elements.
 *
 * @see [Ember Nexus API: Get Index Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-index)
 */
class GetIndexEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementGetIndexEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
    private collectionParser: CollectionParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetIndexEndpoint {
    return new GetIndexEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<CollectionParser>(ServiceIdentifier.serviceCollectionParser),
    );
  }

  async getIndex(
    page: number = 1,
    pageSize: number = 25,
    etag?: string,
  ): Promise<ParsedResponse<Collection> | NotModifiedResponse> {
    try {
      if (page < 1) {
        throw new ValidationError('Page number must be at least 1.');
      }
      if (pageSize < 1) {
        throw new ValidationError('Page size must be at least 1.');
      }
      const url = this.fetchHelper.buildUrl(`/?page=${page}&pageSize=${pageSize}`);
      this.logger.debug(`Executing HTTP GET request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultGetOptions(etag)).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      if (response.status === 304) {
        return { response: response } as NotModifiedResponse;
      }

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const collection = await this.collectionParser.deserializeCollection(rawData);

      return {
        data: collection,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { GetIndexEndpoint };
