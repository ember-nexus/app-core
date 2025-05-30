import { ValidationError } from '../../Error/index.js';
import { CollectionParser, FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { Collection, Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The get element related endpoint retrieves all related nodes of a single center node.
 *
 * The related nodes are paginated. Within each page, all relations between the center node and the related nodes
 * contained on the page are returned.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=getelementrelatedendpoint)
 * @see [Ember Nexus API: Get Element Related Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/get-related)
 */
class GetElementRelatedEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementGetElementRelatedEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
    private collectionParser: CollectionParser,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): GetElementRelatedEndpoint {
    return new GetElementRelatedEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.fetchHelper),
      serviceResolver.getServiceOrFail<CollectionParser>(ServiceIdentifier.collectionParser),
    );
  }

  getElementRelated(centerId: Uuid, page: number = 1, pageSize: number = 25): Promise<Collection> {
    return Promise.resolve()
      .then(() => {
        this.validateArguments(page, pageSize);
        const url = this.fetchHelper.buildUrl(`/${centerId}/related?page=${page}&pageSize=${pageSize}`);
        this.logger.debug(`Executing HTTP GET request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultGetOptions());
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseJsonResponse(response))
      .then((json) => this.collectionParser.deserializeCollection(json))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }

  private validateArguments(page: number, pageSize: number): void {
    if (page < 1) {
      throw new ValidationError('Page number must be at least 1.');
    }
    if (pageSize < 1) {
      throw new ValidationError('Page size must be at least 1.');
    }
  }
}

export { GetElementRelatedEndpoint };
