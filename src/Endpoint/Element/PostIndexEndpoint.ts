import { FetchHelper, Logger, ServiceResolver } from '../../Service/index.js';
import { NodeWithOptionalId, RelationWithOptionalId, Uuid } from '../../Type/Definition/index.js';
import { ServiceIdentifier } from '../../Type/Enum/index.js';

/**
 * The post index endpoint creates a single element.
 *
 * @see [Further documentation](https://ember-nexus.github.io/web-sdk/#/endpoints/element?id=postindexendpoint)
 * @see [Ember Nexus API: Create Root Level Element Endpoint](https://ember-nexus.github.io/api/#/api-endpoints/element/post-index)
 */
class PostIndexEndpoint {
  static identifier: ServiceIdentifier = ServiceIdentifier.endpointElementPostIndexEndpoint;
  constructor(
    private logger: Logger,
    private fetchHelper: FetchHelper,
  ) {}

  static constructFromServiceResolver(serviceResolver: ServiceResolver): PostIndexEndpoint {
    return new PostIndexEndpoint(
      serviceResolver.getServiceOrFail<Logger>(ServiceIdentifier.logger),
      serviceResolver.getServiceOrFail<FetchHelper>(ServiceIdentifier.fetchHelper),
    );
  }

  postIndex(element: NodeWithOptionalId | RelationWithOptionalId): Promise<Uuid> {
    return Promise.resolve()
      .then(() => {
        const url = this.fetchHelper.buildUrl(`/`);
        this.logger.debug(`Executing HTTP POST request against URL: ${url}`);
        return fetch(url, this.fetchHelper.getDefaultPostOptions(JSON.stringify(element)));
      })
      .catch((error) => this.fetchHelper.rethrowErrorAsNetworkError(error))
      .then((response) => this.fetchHelper.parseLocationResponse(response))
      .catch((error) => this.fetchHelper.logAndThrowError(error));
  }
}

export { PostIndexEndpoint };
