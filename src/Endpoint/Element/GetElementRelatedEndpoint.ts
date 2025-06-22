import { ValidationError } from '../../Error/index.js';
import { CollectionParser, FetchHelper, ServiceResolver } from '../../Service/index.js';
import { Collection, LoggerInterface, Uuid } from '../../Type/Definition/index.js';
import { NotModifiedResponse, ParsedResponse } from '../../Type/Definition/Response/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get element related endpoint retrieves all related nodes of a single center node.
 *
 * The related nodes are paginated. Within each page, all relations between the center node and the related nodes
 * contained on the page are returned.
 *
 * @see [Ember Nexus API: Get Element Related Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-related)
 */
class GetElementRelatedEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementGetElementRelatedEndpoint;
  constructor(
    private logger: LoggerInterface,
    private fetchHelper: FetchHelper,
    private collectionParser: CollectionParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetElementRelatedEndpoint {
    return new GetElementRelatedEndpoint(
      serviceResolver.getServiceOrFail<LoggerInterface>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
      serviceResolver.getServiceOrFail<CollectionParser>(ServiceIdentifier.serviceCollectionParser),
    );
  }

  async getElementRelated(
    centerId: Uuid,
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
      const url = this.fetchHelper.buildUrl(`/${centerId}/related?page=${page}&pageSize=${pageSize}`);
      this.logger.debug(`Executing HTTP GET request against URL: ${url}`);

      const response = await fetch(url, this.fetchHelper.getDefaultGetOptions(etag)).catch((error) =>
        this.fetchHelper.rethrowErrorAsNetworkError(error),
      );

      if (response.status === 304) {
        return { response: response } as NotModifiedResponse;
      }

      const rawData = await this.fetchHelper.parseJsonResponse(response);
      const collection = this.collectionParser.deserializeCollection(rawData);

      return {
        data: collection,
        response: response,
      };
    } catch (error) {
      this.fetchHelper.logAndThrowError(error);
    }
  }
}

export { GetElementRelatedEndpoint };
