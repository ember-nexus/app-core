import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { NodeWithOptionalId, Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post element endpoint creates a single child node.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=postelementendpoint)
 * @see [Ember Nexus API: Create Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-element)
 */
class PostElementEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPostElementEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostElementEndpoint {
    return new PostElementEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.serviceFetchHelper),
    );
  }

  postElement(parentId: Uuid, element: NodeWithOptionalId): Promise<Uuid> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/${parentId}`);
        this.logger.debug(`Executing HTTP POST request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(element)));
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseLocationResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PostElementEndpoint };
